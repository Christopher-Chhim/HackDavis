'use client';

import { useState, useEffect } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import MallCanvas from '../_components/mall';

interface Door {
  id: number;
  open: boolean;
}

interface Zone {
  id: number;
  status: 'ok' | 'caution' | 'danger';
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    let doorChannel: RealtimeChannel;
    let zoneChannel: RealtimeChannel;

    const fetchDoors = async () => {
      const { data, error } = await supabase
        .from('doors')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error fetching doors:', error);
      } else {
        console.log('Doors fetched:', data);
        setDoors(data);
      }
    };

    const fetchZones = async () => {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error fetching zones:', error);
      } else {
        console.log('Zones fetched:', data);
        setZones(data);
      }
    };

    doorChannel = supabase
      .channel('door-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'doors',
        },
        (payload) => {
          console.log('Door update received:', payload.new);
          setDoors((prevDoors) =>
            prevDoors.map((door) =>
              door.id === (payload.new as Door).id
                ? (payload.new as Door)
                : door
            )
          );
        }
      )
      .subscribe();

    zoneChannel = supabase
      .channel('zone-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'zones' },
        (payload) => {
          console.log('Zone update received:', payload.new);
          setZones((prevZones) =>
            prevZones.map((zone) =>
              zone.id === (payload.new as Zone).id
                ? (payload.new as Zone)
                : zone
            )
          );
        }
      )
      .subscribe();

    fetchDoors();
    fetchZones();

    return () => {
      doorChannel.unsubscribe();
      zoneChannel.unsubscribe();
    };
  }, []);

  const zoneNames = [
    'Banana Store',
    'Lululime',
    'Victoria',
    'PayMore',
    'StudyStart',
    'HandLocker',
    'Orange Republic',
    'South Hallway',
    'North Hallway',
  ];

  // Hardcoded neighbors for each store
  const neighbors = {
    0: [1, 8],
    1: [0, 8],
    2: [8],
    3: [8],
    4: [7],
    5: [8, 7, 6],
    6: [5, 7, 8],
    7: [4, 5, 6],
    8: [0, 1, 2, 3, 5, 6],
  };

  function determineZoneColor(status: string, index: number) {
    // Determine the color based on the status and neighbors
    if (status === 'ok') {
      if (
        neighbors[index as keyof typeof neighbors].some(
          (neighbor) => zones[neighbor]?.status === 'danger'
        )
      ) {
        return 'text-yellow-400'; // Caution color if any neighbor is in danger
      }
      return 'text-green-400';
    } else if (status === 'caution') {
      return 'text-yellow-400';
    } else if (status === 'danger') {
      return 'text-red-400';
    } else {
      // Default color if status is not recognized
      return 'text-green-400';
    }
  }

  function determineZoneStatus(status: string, index: number) {
    // Determine the status based on the status and neighbors
    if (status === 'ok') {
      if (
        neighbors[index as keyof typeof neighbors].some(
          (neighbor) => zones[neighbor]?.status === 'danger'
        )
      ) {
        return 'caution';
      }
      return 'ok';
    } else if (status === 'caution') {
      return 'caution';
    } else if (status === 'danger') {
      return 'danger';
    } else {
      return 'ok';
    }
  }

  return (
    <div className={'flex flex-col items-center justify-center relative'}>
      <div className='absolute top-4 left-4 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50'>
        <div className='flex flex-col text-white border-2 border-white h-[350px] w-[300px] justify-center items-center'>
          <h1 className='text-center text-2xl font-bold underline'>Status</h1>
          <div className='flex flex-col items-center justify-center h-full'>
            {zones.map((zone, index) => (
              <div key={zone.id} className='flex items-center mb-2'>
                {zoneNames[index] && (
                  <span className='mr-2'>
                    {`${zoneNames[index]}:`}{' '}
                    <span
                      className={`${determineZoneColor(zone.status, index)}`}
                    >{`${determineZoneStatus(zone.status, index)}`}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {doors.length !== 0 && zones.length !== 0 ? (
        <>
          <header
            className={'flex flex-col items-center justify-center h-[100px]'}
          >
            <h1>Mall 3D</h1>
            <p>A 3D mall simulation built with React Three Fiber</p>
          </header>
          <MallCanvas doors={doors} zones={zones} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
