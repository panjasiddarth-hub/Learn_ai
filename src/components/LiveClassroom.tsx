import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, MessageSquare, Hand, Mic, MicOff, VideoOff, Monitor, Phone, Plus, Clock, ChevronRight, Play } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function LiveClassroom() {
  const { theme, classrooms, joinClassroom, user } = useApp();
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState<'list' | 'join' | 'live'>('list');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Priya', message: 'Can you explain that again sir?', time: '10:15' },
    { id: 2, user: 'Teacher', message: 'Sure, let me repeat the formula.', time: '10:16', isTeacher: true },
  ]);

  const handleJoin = () => {
    if (joinClassroom(joinCode)) {
      const classroom = classrooms.find(c => c.code.toLowerCase() === joinCode.toLowerCase());
      setCurrentClass(classroom);
      setActiveView('live');
      setJoinError('');
    } else {
      setJoinError('Invalid class code. Please try again.');
    }
  };

  const joinLiveClass = (classroom: any) => {
    setCurrentClass(classroom);
    setActiveView('live');
  };

  const sendChat = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), user: user?.name || 'You', message: chatMessage, time: new Date().toLocaleTimeString().substring(0, 5) }]);
    setChatMessage('');
  };

  const liveClasses = classrooms.filter(c => c.isLive);
  const upcomingClasses = classrooms.filter(c => !c.isLive);

  return (
    <div className="space-y-6">
      {activeView === 'list' && (
        <>
          {/* Header */}
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} border rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg shadow-blue-500/25">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">Live Classrooms</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Join live classes and interact with teachers</p>
                </div>
              </div>
              <button onClick={() => setActiveView('join')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer flex items-center gap-2">
                <Plus className="h-4 w-4" /> Join with Code
              </button>
            </div>
          </div>

          {/* Live Now */}
          {liveClasses.length > 0 && (
            <div>
              <h3 className="font-bold font-display text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Live Now
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {liveClasses.map(c => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border rounded-2xl p-5`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold">{c.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{c.teacher}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse">LIVE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{c.students} students</span>
                      </div>
                      <button onClick={() => joinLiveClass(c)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition cursor-pointer flex items-center gap-2">
                        <Play className="h-4 w-4" /> Join Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div>
            <h3 className="font-bold font-display text-lg mb-4">Upcoming Classes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingClasses.map(c => (
                <div key={c.id} className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-5`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl`}>
                      <Video className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{c.teacher}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{c.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Code: {c.code}</span>
                    <ChevronRight className={`h-5 w-5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeView === 'join' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30 mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display">Join a Class</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Enter the class code provided by your teacher</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1.5 block`}>Class Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g., MATH10A"
                  className={`w-full px-4 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl text-center text-lg tracking-widest uppercase focus:border-blue-500`}
                />
              </div>

              {joinError && (
                <p className="text-red-500 text-sm text-center">{joinError}</p>
              )}

              <button onClick={handleJoin} disabled={!joinCode.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-400 transition shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50">
                Join Class
              </button>

              <button onClick={() => setActiveView('list')}
                className={`w-full py-3 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-medium transition cursor-pointer`}>
                Back to Classes
              </button>
            </div>

            <div className={`mt-6 p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border rounded-xl`}>
              <p className="text-xs text-center">
                <span className="font-medium">Demo codes:</span> MATH10A, PHY10B, CHEM10C
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeView === 'live' && currentClass && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-10rem)]">
          <div className="grid lg:grid-cols-4 gap-4 h-full">
            {/* Video Area */}
            <div className="lg:col-span-3 flex flex-col">
              {/* Main Video */}
              <div className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-800'} rounded-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👨‍🏫</span>
                    </div>
                    <p className="text-white text-lg font-bold">{currentClass.teacher}</p>
                    <p className="text-gray-400 text-sm">{currentClass.name}</p>
                  </div>
                </div>

                {/* Class Info */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                  </span>
                  <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-lg flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {currentClass.students + 1}
                  </span>
                </div>

                {/* Self Video */}
                <div className="absolute bottom-4 right-4 w-40 h-28 bg-gray-700 rounded-xl overflow-hidden border-2 border-white/20">
                  {isVideoOff ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-xl">{user?.avatar}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                      <span className="text-2xl">{user?.avatar}</span>
                    </div>
                  )}
                  <p className="absolute bottom-1 left-2 text-white text-[10px]">You</p>
                </div>
              </div>

              {/* Controls */}
              <div className={`mt-4 p-4 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl flex items-center justify-center gap-4`}>
                <button onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition cursor-pointer ${isMuted ? 'bg-red-500 text-white' : `${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}`}>
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-full transition cursor-pointer ${isVideoOff ? 'bg-red-500 text-white' : `${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}`}>
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
                <button className={`p-4 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition cursor-pointer`}>
                  <Monitor className="h-5 w-5" />
                </button>
                <button onClick={() => setHandRaised(!handRaised)}
                  className={`p-4 rounded-full transition cursor-pointer ${handRaised ? 'bg-amber-500 text-white' : `${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}`}>
                  <Hand className="h-5 w-5" />
                </button>
                <button onClick={() => setActiveView('list')}
                  className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer">
                  <Phone className="h-5 w-5 rotate-[135deg]" />
                </button>
              </div>
            </div>

            {/* Chat Sidebar */}
            <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl flex flex-col`}>
              <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Class Chat
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`p-3 rounded-xl ${msg.isTeacher ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : (isDark ? 'bg-white/[0.03]' : 'bg-gray-50')}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${msg.isTeacher ? 'text-blue-500' : ''}`}>{msg.user}</span>
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>

              <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Type a message..."
                    className={`flex-1 px-3 py-2 ${isDark ? 'bg-white/5 text-white placeholder-gray-600' : 'bg-gray-50 placeholder-gray-400'} rounded-lg text-sm focus:outline-none`}
                  />
                  <button onClick={sendChat} className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
