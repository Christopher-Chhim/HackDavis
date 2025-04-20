"use client";

import { useState, useEffect } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";

interface Door {
  id: number;
  open: boolean;
}

interface Zone {
  id: number;
  status: "ok" | "caution" | "danger";
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    let doorChannel: RealtimeChannel;
    let zoneChannel: RealtimeChannel;

    const fetchDoors = async () => {
      const { data, error } = await supabase
        .from("doors")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching doors:", error);
      } else {
        console.log("Doors fetched:", data);
        setDoors(data);
      }
    };

    const fetchZones = async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching zones:", error);
      } else {
        console.log("Zones fetched:", data);
        setZones(data);
      }
    };

    doorChannel = supabase
      .channel("door-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "doors",
        },
        (payload) => {
          console.log("Door update received:", payload.new);
          setDoors(payload.new as Door[]);
        }
      )
      .subscribe();

    zoneChannel = supabase
      .channel("zone-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "zones" },
        (payload) => {
          console.log("Zone update received:", payload.new);
          setZones(payload.new as Zone[]);
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

  return (
    <>
      <div>Hello</div>
    </>
  );
}
