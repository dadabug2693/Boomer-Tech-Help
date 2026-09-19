/* ==========================================================================
   Boomer Tech Help — guide library data
   The only place guide and topic information lives. js/guides.js reads it
   to build the Popular Questions, Browse by Topic and All Help Guides
   sections, so adding a guide means adding one record to GUIDES below.

   To publish a guide's article page, set its `url` (e.g.
   '/guides/how-do-i-scan-a-qr-code/'). Its card then switches from a
   "Coming soon" status to a "Read the guide" link automatically.
   ========================================================================== */

window.BTH_GUIDE_LIBRARY = (function () {
  'use strict';

  // `icon` names a drawing in ICONS inside js/guides.js.
  var CATEGORIES = [
    { id: 'phones-tablets', name: 'Phones and Tablets', icon: 'phone',
      description: 'Help with iPhone, Android phones, iPad, settings, and everyday phone features.' },
    { id: 'email-text', name: 'Email and Text Messages', icon: 'message',
      description: 'Help with sending messages, attachments, spam, missing messages, and communication problems.' },
    { id: 'safety-scams', name: 'Safety and Scams', icon: 'shield',
      description: 'Help recognizing suspicious emails, fraudulent texts, pop-ups, unsafe links, and account threats.' },
    { id: 'internet-wifi', name: 'Internet and Wi-Fi', icon: 'wifi',
      description: 'Help connecting devices, understanding Wi-Fi and mobile data, and diagnosing slow connections.' },
    { id: 'photos-files', name: 'Photos, Files and Storage', icon: 'folder',
      description: 'Help finding downloads, managing photos, sharing files, using cloud storage, and freeing space.' },
    { id: 'accounts-passwords', name: 'Accounts and Passwords', icon: 'key',
      description: 'Help with forgotten passwords, verification codes, Apple and Google accounts, and account security.' },
    { id: 'video-social', name: 'Video Calls and Social Media', icon: 'video',
      description: 'Help using FaceTime, Zoom, Facebook, YouTube, microphones, and cameras.' },
    { id: 'streaming-smart', name: 'Streaming and Smart Devices', icon: 'tv',
      description: 'Help with smart televisions, streaming devices, Bluetooth, printers, and smart speakers.' }
  ];

  // Order here is the display order in All Help Guides.
  // `popular` is optional: guides with a number appear under Popular Questions, lowest first.
  var GUIDES = [
    { id: 'email-scam-signs', category: 'safety-scams', popular: 1, readingMinutes: 5, url: null,
      title: 'How Do I Know If an Email Is a Scam?',
      description: 'Learn the common warning signs that an email may be trying to steal your information.',
      keywords: ['email', 'scam', 'phishing', 'suspicious', 'fraud'] },

    { id: 'phone-running-slowly', category: 'phones-tablets', popular: 2, readingMinutes: 6, url: null,
      title: 'Why Is My Phone Running So Slowly?',
      description: 'Understand the most common reasons a phone slows down and what you can safely try.',
      keywords: ['phone', 'slow', 'storage', 'apps', 'performance'] },

    { id: 'bigger-text-on-phone', category: 'phones-tablets', popular: 3, readingMinutes: 4, url: null,
      title: 'How Do I Make the Text Bigger on My Phone?',
      description: 'Adjust the text size on an iPhone or Android phone so it is more comfortable to read.',
      keywords: ['text', 'font', 'bigger', 'display', 'accessibility'] },

    { id: 'scan-qr-code', category: 'phones-tablets', popular: 4, readingMinutes: 4, url: null,
      title: 'How Do I Scan a QR Code?',
      description: 'Use your phone’s camera to open the information connected to a QR code.',
      keywords: ['QR', 'code', 'camera', 'scan', 'link'] },

    { id: 'airplane-mode', category: 'phones-tablets', popular: 5, readingMinutes: 4, url: null,
      title: 'What Does Airplane Mode Actually Do?',
      description: 'Learn which wireless connections airplane mode turns off and when the setting is useful.',
      keywords: ['airplane mode', 'Wi-Fi', 'Bluetooth', 'cellular', 'travel'] },

    { id: 'text-message-not-sending', category: 'email-text', popular: 6, readingMinutes: 6, url: null,
      title: 'Why Won’t My Phone Send a Text Message?',
      description: 'Check the most likely reasons a text message fails and the safest fixes to try first.',
      keywords: ['text', 'SMS', 'message', 'not delivered', 'cellular'] },

    { id: 'stop-spam-calls', category: 'safety-scams', readingMinutes: 5, url: null,
      title: 'How Do I Stop Spam Calls?',
      description: 'Reduce unwanted calls and learn how to block a suspicious or persistent caller.',
      keywords: ['spam', 'calls', 'block', 'unknown caller', 'robocall'] },

    { id: 'website-cookies', category: 'internet-wifi', readingMinutes: 5, url: null,
      title: 'What Are Website Cookies?',
      description: 'Understand what website cookies do and what it means when a website asks you to accept them.',
      keywords: ['cookies', 'website', 'browser', 'privacy', 'tracking'] },

    { id: 'screen-keeps-rotating', category: 'phones-tablets', readingMinutes: 3, url: null,
      title: 'Why Does My Phone Keep Rotating the Screen?',
      description: 'Learn how screen rotation works and how to keep the screen in the position you prefer.',
      keywords: ['screen', 'rotate', 'orientation', 'portrait', 'landscape'] },

    { id: 'wifi-vs-mobile-data', category: 'internet-wifi', readingMinutes: 5, url: null,
      title: 'What Is the Difference Between Wi-Fi and Mobile Data?',
      description: 'Learn how the two connections differ and when your phone uses each one.',
      keywords: ['Wi-Fi', 'mobile data', 'cellular', 'internet', 'data plan'] },

    { id: 'downloaded-files-location', category: 'photos-files', readingMinutes: 6, url: null,
      title: 'Where Do Downloaded Files Go on My Phone?',
      description: 'Find files, pictures, and documents you downloaded on an iPhone or Android phone.',
      keywords: ['downloads', 'files', 'folder', 'photo', 'document'] },

    { id: 'verification-code', category: 'accounts-passwords', readingMinutes: 5, url: null,
      title: 'Why Am I Being Asked for a Verification Code?',
      description: 'Understand why companies send verification codes and when you should never share one.',
      keywords: ['verification code', 'security code', 'two-factor authentication', 'login', 'scam'] }
  ];

  return { categories: CATEGORIES, guides: GUIDES };
})();
