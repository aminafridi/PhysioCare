'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card } from '@/components/ui';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function BookingCalendar() {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Mock calendar days for specific month structure (e.g., current month)
    // 35 days grid
    const calendarDays = Array.from({ length: 35 }, (_, i) => {
        const day = i - 2; // Offset for start day
        return day > 0 && day <= 30 ? day : null;
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Calendar Container */}
            <div className="bg-secondary-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <button className="p-1 hover:bg-secondary-200 rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4 text-secondary-600" />
                    </button>
                    <span className="font-bold text-secondary-900">October 2023</span>
                    <button className="p-1 hover:bg-secondary-200 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-secondary-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4 text-center text-xs text-secondary-400 font-semibold tracking-wider">
                    {days.map(d => <div key={d}>{d[0]}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, i) => (
                        <div key={i} className="aspect-square flex items-center justify-center">
                            {day ? (
                                <button
                                    onClick={() => setSelectedDate(day)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                                        ${selectedDate === day
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-secondary-700 hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    {day}
                                </button>
                            ) : (
                                <div />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Selection Dropdown */}
            <div>
                <label className="block text-secondary-900 font-medium mb-3">
                    Preferred Time Slot
                </label>
                <div className="relative">
                    <select
                        value={selectedTime || ''}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full appearance-none bg-white border border-secondary-200 rounded-xl px-4 py-3 pr-10 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                    >
                        <option value="" disabled>09:00 AM</option>
                        {hours.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-secondary-400">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { CheckCircle } from 'lucide-react';
