import { supabase } from '@/utils/supabase';

export interface Packet {
  id?: string; // UUID in database
  packet_id: string; // The display ID (e.g. PK-001)
  sender: string;
  duration: string;
  amount: number;
  date: string;
  created_at?: string;
}

export interface ArchivedPacket extends Packet {
  outward_date: string;
}

export type LogAction = 'LOGIN' | 'LOGOUT' | 'INWARD' | 'OUTWARD' | 'DATA_EXPORT';

export const parseDurationToDays = (durationStr: string): number => {
  const num = parseInt(durationStr);
  if (isNaN(num)) return 0;
  
  const unit = durationStr.toLowerCase();
  if (unit.includes('year')) return num * 365;
  if (unit.includes('month')) return num * 30;
  if (unit.includes('week')) return num * 7;
  if (unit.includes('day')) return num;
  return 0;
};

export const logEvent = async (action: LogAction, entityType?: string, entityId?: string, details?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    });
  } catch (error) {
    console.error('Logging error:', error);
  }
};

export const packetService = {
  getPackets: async (): Promise<Packet[]> => {
    const { data, error } = await supabase
      .from('packets')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching packets:', error);
      return [];
    }
    return data || [];
  },

  getArchivedPackets: async (): Promise<ArchivedPacket[]> => {
    const { data, error } = await supabase
      .from('archived_packets')
      .select('*')
      .order('outward_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching archived packets:', error);
      return [];
    }
    return data || [];
  },

  addPacket: async (packet: Omit<Packet, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('packets')
      .insert([packet])
      .select()
      .single();

    if (error) {
      throw error;
    }

    await logEvent('INWARD', 'PACKET', packet.packet_id, packet);
    return data;
  },

  deletePacket: async (packetId: string) => {
    // 1. Get the packet first to archive it
    const { data: packet, error: fetchError } = await supabase
      .from('packets')
      .update({ id: undefined }) // This is just to get the data, let's use select
      .select()
      .eq('packet_id', packetId)
      .single();

    if (fetchError || !packet) throw new Error('Packet not found');

    // 2. Add to archive
    const { error: archiveError } = await supabase
      .from('archived_packets')
      .insert([{
        packet_id: packet.packet_id,
        sender: packet.sender,
        duration: packet.duration,
        amount: packet.amount,
        date: packet.date,
        outward_date: new Date().toISOString()
      }]);

    if (archiveError) throw archiveError;

    // 3. Remove from active
    const { error: deleteError } = await supabase
      .from('packets')
      .delete()
      .eq('packet_id', packetId);

    if (deleteError) throw deleteError;

    await logEvent('OUTWARD', 'PACKET', packetId, packet);
    return true;
  },

  getStats: async () => {
    const { data: packets, error } = await supabase.from('packets').select('amount, date, duration');
    if (error || !packets) return { totalPackets: 0, totalValue: 0, dueSoon: 0 };

    const totalValue = packets.reduce((sum, p) => sum + Number(p.amount), 0);
    
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const dueSoonCount = packets.filter(p => {
      const startDate = new Date(p.date);
      const days = parseDurationToDays(p.duration);
      const dueDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= threeMonthsFromNow;
    }).length;

    return {
      totalPackets: packets.length,
      totalValue: totalValue,
      dueSoon: dueSoonCount,
    };
  }
};
