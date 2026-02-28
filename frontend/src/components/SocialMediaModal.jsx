import { useState, useEffect } from 'react';
import { X, Instagram, Youtube, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function SocialMediaModal({ isOpen, onClose, platform, username }) {
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  const getSocialMediaUrl = () => {
    switch (platform) {
      case 'instagram':
        // Handle full Instagram URLs (reels, posts, profiles)
        if (username.includes('instagram.com/')) {
          return username;
        }
        return `https://www.instagram.com/${username.replace('@', '')}`;
      case 'youtube':
        // Handle full YouTube URLs or channel names
        if (username.includes('youtube.com/') || username.includes('youtu.be/')) {
          return username;
        }
        return `https://www.youtube.com/@${username}`;
      case 'twitter':
        // Handle full Twitter URLs
        if (username.includes('twitter.com/') || username.includes('x.com/')) {
          return username;
        }
        return `https://twitter.com/${username.replace('@', '')}`;
      case 'linkedin':
        // Handle full LinkedIn URLs
        if (username.includes('linkedin.com/')) {
          return username;
        }
        return `https://www.linkedin.com/in/${username}`;
      case 'facebook':
        // Handle full Facebook URLs
        if (username.includes('facebook.com/')) {
          return username;
        }
        return `https://www.facebook.com/${username}`;
      default:
        return '#';
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-6 h-6 text-pink-600" />;
      case 'youtube':
        return <Youtube className="w-6 h-6 text-red-600" />;
      case 'twitter':
        return <Twitter className="w-6 h-6 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6 text-blue-700" />;
      case 'facebook':
        return <Facebook className="w-6 h-6 text-blue-800" />;
      default:
        return null;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      case 'twitter':
        return 'Twitter';
      case 'linkedin':
        return 'LinkedIn';
      case 'facebook':
        return 'Facebook';
      default:
        return '';
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case 'instagram':
        return '#E1306C';
      case 'youtube':
        return '#FF0000';
      case 'twitter':
        return '#1DA1F2';
      case 'linkedin':
        return '#0077B5';
      case 'facebook':
        return '#1877F2';
      default:
        return '#666666';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            {getPlatformIcon()}
            <h2 className="text-xl font-semibold text-gray-900">
              {getPlatformName()} - {username.includes('instagram.com/') || username.includes('youtube.com/') || 
                 username.includes('twitter.com/') || username.includes('linkedin.com/') || 
                 username.includes('facebook.com/') 
                  ? 'Content' 
                  : `@${username}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Simple Preview Area */}
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
            <div className="text-center p-4">
              {getPlatformIcon()}
              <h3 className="text-lg font-semibold mt-2 mb-1" style={{ color: getPlatformColor() }}>
                {getPlatformName()}
              </h3>
              <p className="text-sm text-gray-600">
                Click below to view on {getPlatformName()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Click outside or press ESC to close
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(getSocialMediaUrl(), '_blank', 'noopener,noreferrer')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in New Tab
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
