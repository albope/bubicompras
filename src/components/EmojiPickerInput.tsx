import React, { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EmojiPickerInput: React.FC<EmojiPickerInputProps> = ({
  value,
  onChange,
  placeholder,
  className
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setShowPicker(false);
    }
  };

  const calculatePickerPosition = () => {
    if (!containerRef.current || !pickerRef.current) return { top: '100%' };

    const containerRect = containerRef.current.getBoundingClientRect();
    const pickerHeight = 400; // Approximate height of emoji picker
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    // If there's not enough space below and more space above
    if (spaceBelow < pickerHeight && spaceAbove > spaceBelow) {
      return {
        bottom: '100%',
        maxHeight: `${Math.min(spaceAbove - 10, pickerHeight)}px`
      };
    }

    // Default to showing below
    return {
      top: '100%',
      maxHeight: `${Math.min(spaceBelow - 10, pickerHeight)}px`
    };
  };

  React.useEffect(() => {
    if (showPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPicker]);

  const handleEmojiSelect = (emoji: any) => {
    onChange(value + emoji.native);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex items-center bg-white overflow-hidden transition-all duration-200 ${
          isFocused 
            ? 'ring-2 ring-blue-500 border-transparent' 
            : 'ring-1 ring-gray-200 hover:ring-gray-300'
        } rounded-md shadow-sm`}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`flex-1 min-w-0 px-3 py-2 border-0 focus:ring-0 text-base placeholder-gray-400 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`px-2 py-2 h-[38px] text-gray-400 hover:text-gray-600 transition-colors shrink-0 hover:bg-gray-50 ${
            showPicker ? 'bg-gray-50 text-gray-600' : ''
          }`}
        >
          <Smile size={18} />
        </button>
      </div>
      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute right-0 z-[100] shadow-xl rounded-lg bg-white border border-gray-200"
          style={{
            ...calculatePickerPosition(),
            width: '352px', // Fixed width to match emoji-mart's default
            overflow: 'hidden'
          }}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            locale="es"
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerInput;