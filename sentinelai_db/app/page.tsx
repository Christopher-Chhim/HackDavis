'use client';

import { useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building,
  Radio,
  Brain,
  Zap,
  ArrowRight,
  Volume2,
  Lock,
  Map,
  MessageSquare,
  Users,
} from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';

// 3D Model component
function Model(props: any) {
  const { scene } = useGLTF('/model.glb');

  // Rotate the model slowly
  useFrame((state) => {
    scene.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return <primitive object={scene} {...props} />;
}

interface Zone {
  id: number;
  status: 'ok' | 'caution' | 'danger';
}


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [doors, setDoors] = useState([]);
  const [zones, setZones] = useState([]);
  let doorChannel: RealtimeChannel;
  let zoneChannel: RealtimeChannel;

  const zoneNames = [
    'Banana Store',
    'Lululime',
    'Victoria',
    'PayMore',
    'StudyStart',
    'HandLocker',
    'Orange Republic',
  ];

  const zoneColors = {
    ok: 'text-green-400',
    caution: 'text-yellow-400',
    danger: 'text-red-400',
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* 1) Fullscreen draggable 3D background */}
        <div className="absolute inset-0 z-0">
          <Canvas
            className="h-full w-full"
            camera={{ position: [0, 50, 5], fov: 45 }}
            style={{ touchAction: 'none' }} // ensure drag works on touch
          >
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
            />
            <Suspense fallback={null}>
              <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 300 }}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
              >
                <Model scale={1.5} position={[0, -1, 0]} />
              </PresentationControls>
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* 2) Text + buttons overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 container mx-auto px-2 flex flex-col lg:flex-row items-center justify-center w-[50%] h-[50%] pointer-events-none bg-black bg-opacity-50 rounded-xl">
          <div className="mb-12 lg:mb-0 pointer-events-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-white">
              Sentinel AI
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-100">
              AI-Powered Public Safety Orchestration
            </h2>
            <p className="text-lg md:text-xl mb-8 text-slate-300 max-w-xl">
              Intelligent audio monitoring and real-time emergency response
              coordination for buildings and public spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-950 text-white"
              >
                Request Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-950"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
          <p className="text-sm text-white mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SentinelAI Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Continuous monitoring and intelligent response coordination in
              emergency situations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-6">
                  <Volume2 className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Panic Detection Engine
                </h3>
                <p className="text-slate-300">
                  Edge-deployed audio models detect screams, gunshots,
                  stampedes, and chaos across distributed microphones.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-6">
                  <Brain className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Sentinel Superintendent LLM
                </h3>
                <p className="text-slate-300">
                  Real-time agent with contextual awareness that speaks to users
                  via intercom systems, guiding them calmly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-6">
                  <Building className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Building Integration</h3>
                <p className="text-slate-300">
                  Direct control over smart doors, alarms, digital signage, and
                  lights through IoT integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Advanced capabilities that make SentinelAI the most comprehensive
              safety system available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Map className="h-6 w-6 text-blue-400" />,
                title: 'Multi-Zone Awareness',
                description:
                  'Coordinate different responses in different zones (lockdown in Zone A, evacuation in Zone B).',
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
                title: 'Emotion-Adaptive Dialogue',
                description:
                  'Adjusts tone and pace of instructions based on real-time emotion detection.',
              },
              {
                icon: <Users className="h-6 w-6 text-blue-400" />,
                title: 'Human-in-the-Loop Panel',
                description:
                  'Security staff have override and transparency through a central dashboard.',
              },
              {
                icon: <Radio className="h-6 w-6 text-blue-400" />,
                title: 'Real-Time Communication',
                description:
                  'Instantly connects with occupants through intercom and mobile notifications.',
              },
              {
                icon: <Lock className="h-6 w-6 text-blue-400" />,
                title: 'Secure Access Control',
                description:
                  'Intelligent management of doors and access points during emergencies.',
              },
              {
                icon: <Zap className="h-6 w-6 text-blue-400" />,
                title: 'Rapid Response',
                description:
                  'Millisecond detection and response time to potential threats.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/60 transition-all duration-300"
              >
                <div className="rounded-full bg-blue-900/20 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protecting What Matters
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              SentinelAI is designed for a variety of environments where safety
              is paramount
            </p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Educational Institutions',
                description:
                  'Protect students and staff with intelligent monitoring and response in schools and universities.',
                image: '/placeholder.svg?height=300&width=600',
              },
              {
                title: 'Corporate Campuses',
                description:
                  'Ensure employee safety with comprehensive emergency management across office buildings.',
                image: '/placeholder.svg?height=300&width=600',
              },
              {
                title: 'Public Venues',
                description:
                  'Coordinate safety in stadiums, theaters, and event spaces with large crowds.',
                image: '/placeholder.svg?height=300&width=600',
              },
              {
                title: 'Healthcare Facilities',
                description:
                  'Protect patients and medical staff with specialized emergency protocols.',
                image: '/placeholder.svg?height=300&width=600',
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <img
                  src={useCase.image || '/placeholder.svg'}
                  alt={useCase.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-slate-300">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-900/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-800/30">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your safety infrastructure?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join the organizations already using SentinelAI to protect what
                matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Schedule a Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-950"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                SentinelAI
              </h2>
              <p className="text-slate-400 mt-2">
                AI-Powered Public Safety Orchestration
              </p>
            </div>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Use Cases
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
            <p>
              © {new Date().getFullYear()} SentinelAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
