// ComponentHydrator.js
"use client";

import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Import the original ClientCounter component
// In the consuming app, you would import this or recreate the component here
import ClientCounter from './ClientCounter'; // Adjust the import path as needed


/**
 * Hydrates a serialized component by attaching event handlers
 * 
 * @param {string} serializedContent - The serialized component string
 * @param {Object} overrideProps - Props to override when hydrating
 * @returns {React.ReactElement} The hydrated component
 */
export function HydratedComponent({ serializedContent = "", overrideProps = {} }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current || !serializedContent) return;
    
    try {
      const { componentName, props } = JSON.parse(serializedContent);
      
      // Get the component implementation
      const Component = ClientCounter;
      
      if (!Component) {
        console.error(`Component "${componentName}" not found in component map`);
        return;
      }
      
      // Create a new root for hydration
      const root = createRoot(containerRef.current);
      
      // Render the component with original and override props
      root.render(<Component {...props} {...overrideProps} />);
      
      // Cleanup function
      return () => {
        root.unmount();
      };
    } catch (error) {
      console.error('Error hydrating component:', error);
    }
  }, [serializedContent, overrideProps]);
  
  // If no serialized content, return null
  if (!serializedContent) return null;
  
  // Parse the serialized content to get the markup
  const { markup } = JSON.parse(serializedContent);
  
  // Return a placeholder that will be hydrated
  return (
    <div 
      ref={containerRef}
      className="hydration-container"
      // Use dangerouslySetInnerHTML to set the initial markup
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}