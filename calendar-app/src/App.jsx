import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon } from 'lucide-react'
import './App.css'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [newEventTitle, setNewEventTitle] = useState('')

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      })
    }
    
    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (dayData) => {
    setSelectedDay(dayData)
    setNewEventTitle('')
  }

  const addEvent = () => {
    if (!selectedDay || !newEventTitle.trim()) return
    
    const key = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`
    const newEvent = {
      id: Date.now(),
      title: newEventTitle.trim(),
      color: 'accent'
    }
    
    setEvents(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newEvent]
    }))
    
    setNewEventTitle('')
  }

  const deleteEvent = (eventId) => {
    if (!selectedDay) return
    
    const key = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`
    setEvents(prev => ({
      ...prev,
      [key]: prev[key].filter(event => event.id !== eventId)
    }))
  }

  const closeEventModal = () => {
    setSelectedDay(null)
    setNewEventTitle('')
  }

  const getEventKey = (dayData) => {
    return `${dayData.year}-${dayData.month}-${dayData.day}`
  }

  const isToday = (dayData) => {
    const today = new Date()
    return dayData.day === today.getDate() && 
           dayData.month === today.getMonth() && 
           dayData.year === today.getFullYear()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4 md:p-8">
      {/* Subtle background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header Card */}
        <header className="glass backdrop-blur-md rounded-3xl p-6 md:p-8 mb-8 shadow-glass border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                <CalendarIcon className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                  {monthNames[currentDate.getMonth()]}
                </h1>
                <p className="text-sm text-gray-500 font-medium">{currentDate.getFullYear()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-5 py-2.5 text-sm font-medium glass hover:bg-white/10 border border-white/10 transition-all duration-200 rounded-xl text-gray-300 hover:text-white"
              >
                Today
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2.5 glass hover:bg-white/10 border border-white/10 transition-all duration-200 rounded-xl text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2.5 glass hover:bg-white/10 border border-white/10 transition-all duration-200 rounded-xl text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-3 px-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Card-based layout */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {days.map((dayData, index) => {
            const eventKey = getEventKey(dayData)
            const dayEvents = events[eventKey] || []
            const hasEvents = dayEvents.length > 0
            const isTodayDay = isToday(dayData)
            
            return (
              <div
                key={index}
                onClick={() => handleDayClick(dayData)}
                className={`
                  group relative min-h-20 md:min-h-28 lg:min-h-32 
                  p-3 md:p-4 cursor-pointer
                  rounded-2xl border transition-all duration-300 ease-out
                  ${!dayData.isCurrentMonth 
                    ? 'bg-dark-900/30 border-white/5 opacity-60' 
                    : 'bg-dark-800/40 border-white/10 hover:border-indigo-500/40'
                  }
                  ${isTodayDay 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                    : ''
                  }
                  hover:bg-dark-700/50 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5
                  active:scale-[0.98]
                `}
              >
                <div className="flex flex-col h-full">
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`
                        text-sm md:text-base font-medium
                        w-8 h-8 md:w-9 md:h-9
                        flex items-center justify-center rounded-full
                        transition-all duration-300
                        ${isTodayDay 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/40 scale-110' 
                          : dayData.isCurrentMonth 
                            ? 'text-gray-200 group-hover:text-white' 
                            : 'text-gray-600'
                        }
                      `}
                    >
                      {dayData.day}
                    </span>
                    
                    {/* Hover indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Plus className="w-4 h-4 text-gray-500 hover:text-indigo-400" />
                    </div>
                  </div>
                  
                  {/* Event Indicators */}
                  {hasEvents && (
                    <div className="mt-auto space-y-1.5">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={event.id}
                          className="group/event flex items-center gap-2 p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all duration-200"
                        >
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-sm" />
                          <span className="text-xs text-gray-300 truncate hidden md:block">
                            {event.title}
                          </span>
                        </div>
                      ))}
                      
                      {dayEvents.length > 2 && (
                        <div className="flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium bg-dark-900/50 px-2 py-0.5 rounded-full border border-white/10">
                            +{dayEvents.length - 2} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Empty state hint on hover */}
                  {!hasEvents && dayData.isCurrentMonth && (
                    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center py-4">
                      <span className="text-xs text-gray-600">Add event</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Event Modal with Glassmorphism */}
        {selectedDay && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={closeEventModal}
          >
            <div 
              className="glass-strong backdrop-blur-xl rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-white/10 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-light text-white">
                    {monthNames[selectedDay.month]} {selectedDay.day}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedDay.year}</p>
                </div>
                <button
                  onClick={closeEventModal}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add Event Form */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                  placeholder="Event title..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-200 text-white placeholder-gray-500"
                  autoFocus
                />
                <button
                  onClick={addEvent}
                  disabled={!newEventTitle.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center gap-2 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(events[getEventKey(selectedDay)] || []).map(event => (
                  <div
                    key={event.id}
                    className="group flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-sm" />
                      <span className="text-sm text-gray-200">{event.title}</span>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
                
                {(events[getEventKey(selectedDay)] || []).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <CalendarIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-sm">No events for this day</p>
                    <p className="text-gray-600 text-xs mt-1">Click the + button to add one</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
