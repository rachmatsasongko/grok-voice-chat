'use client';

// Import necessary modules and components
import { useEffect, useState, useRef } from 'react';
import { useKeyboardKey } from '@/hooks/useKeyboardKey';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { FaPause } from 'react-icons/fa';
import { getResponse } from '@/lib/convai';

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

// Export the MicrophoneComponent function component
export const SpeakButton = () => {
  // State variables to manage recording status, completion, and transcript
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const sendTranscriptHandler = async (text: string) => {
    // setIsMuted(true);
    // const data = await fetch('/api/speech', {
    //   method: 'post',
    //   body: JSON.stringify({ text })
    // });

    // console.log(await data.json());
    // const audio = new Audio('./audio/transcript.wav');
    // audio.onended = () => {
    //   setIsMuted(false);
    // };
    // await audio.play();
    getResponse(text);
  }

  useKeyboardKey({
    key: ' ',
    onKeyPressed: () => {
      if (!isRecording && !isMuted) {
        startRecording();
      }
    },
  });

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
  const startRecording = () => {
    let currentTimeout: NodeJS.Timeout;
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      // clear timeout if there is new transcript
      if (currentTimeout) clearTimeout(currentTimeout);
      const { transcript } = event.results[event.results.length - 1][0];

      // Log the recognition results and update the transcript state
      console.log(event.results);
      // console.log(transcript);

      // set timeout for 1 second
      currentTimeout = setTimeout(() => {
        console.log('Full transcript', transcript);
        sendTranscriptHandler(transcript);
        stopRecording();
      }, 1000);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
    }
  };

  // Render the microphone component with appropriate UI based on recording state
  return (
    <div className='flex items-center w-full'>
      {isRecording ? (
        // Button for stopping recording
        <button
          className='mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <FaPause size={40} />
        </button>
      ) : isMuted ? (
        // Button for listening audio
        <button
          className='mt-10 m-auto flex items-center justify-center bg-gray-400 hover:bg-gray-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <BsFillMicMuteFill size={40} />
        </button>
      ) : (
        // Button for starting recording
        <button
          className='mt-10 m-auto flex items-center justify-center bg-gray-400 hover:bg-gray-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <BsFillMicFill size={40} />
        </button>
      )}
    </div>
  );
}
