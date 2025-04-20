"use client";

import { useState, useEffect } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import MallCanvas from "../_components/mall";

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
      .channel("zone-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "zones" },
        (payload) => {
          console.log("Zone update received:", payload.new);
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

  return (
    <div className={"flex flex-col items-center justify-center"}>
      {doors.length !== 0 && zones.length !== 0 ? (
        <>
          <header
            className={"flex flex-col items-center justify-center h-[100px]"}
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
