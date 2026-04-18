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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-8 h-8 text-accent" />
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm glass hover:bg-white/5 transition-all duration-200 rounded-lg"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 glass hover:bg-white/5 transition-all duration-200 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 glass hover:bg-white/5 transition-all duration-200 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {dayNames.map(day => (
              <div
                key={day}
                className="py-4 text-center text-sm font-medium text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
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
                    min-h-24 md:min-h-32 p-2 md:p-3 cursor-pointer
                    border-b border-r border-white/5
                    transition-all duration-200
                    ${!dayData.isCurrentMonth ? 'bg-black/20' : ''}
                    ${isTodayDay ? 'bg-accent/10' : ''}
                    hover:bg-white/5
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`
                        text-sm md:text-base w-7 h-7 md:w-8 md:h-8
                        flex items-center justify-center rounded-full
                        mb-1 md:mb-2
                        ${isTodayDay 
                          ? 'bg-accent text-white font-semibold shadow-glow' 
                          : dayData.isCurrentMonth 
                            ? 'text-gray-200' 
                            : 'text-gray-600'
                        }
                      `}
                    >
                      {dayData.day}
                    </span>
                    
                    {hasEvents && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={event.id}
                            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent shadow-glow"
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Event Modal */}
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-strong rounded-2xl w-full max-w-md p-6 shadow-glass">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light">
                  {monthNames[selectedDay.month]} {selectedDay.day}, {selectedDay.year}
                </h2>
                <button
                  onClick={closeEventModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add Event Form */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                  placeholder="Add event..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 transition-colors"
                  autoFocus
                />
                <button
                  onClick={addEvent}
                  disabled={!newEventTitle.trim()}
                  className="px-4 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(events[getEventKey(selectedDay)] || []).map(event => (
                  <div
                    key={event.id}
                    className="group flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent shadow-glow" />
                      <span className="text-sm">{event.title}</span>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
                
                {(events[getEventKey(selectedDay)] || []).length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No events for this day
                  </p>
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
