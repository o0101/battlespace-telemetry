import Sensor from './sensor.js';

export default class DeviceProfileSensor extends Sensor {
  #$ = null;

  constructor() {
    const api = {};
    super('deviceProfile', api);
    this.#$ = api;

    // Emit the device profile after a brief timeout to simulate an asynchronous data fetch
    setTimeout(() => this.#$.emit(this.getDeviceProfile()), 0);
  }

  async getDeviceProfile() {
    const profile = {
      screen: {
        width: screen.width,
        height: screen.height,
        dimensions: `${screen.width} x ${screen.height} pixels`,
        colorDepthBits: screen.colorDepth,
        colors: this.getColorDepth(screen.colorDepth),
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      },
      memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Not available',
      cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores ${await this.getArch()}` : `Not available`
    };

    // Enhance the profile with OS and browser info
    const osInfo = await this.getOS();
    const browserInfo = await this.getBrowser();

    // Merge enhanced OS and browser info into the profile
    return {...profile, ...osInfo, ...browserInfo};
  }

  async getOS() {
    let osName = 'Unknown OS';
    let osVersion = '';

    // Use high entropy values if available
    if (navigator.userAgentData) {
      try {
        const highEntropyValues = await navigator.userAgentData.getHighEntropyValues(['platformVersion']);
        osVersion = highEntropyValues.platformVersion;
        osName = navigator.userAgentData.platform || osName;
      } catch (error) {
        console.error('Error getting high entropy values for OS:', error);
      }
    }

    // Fallback to userAgentData or userAgent string
    if (!osVersion) {
      osName = this.parseOSFromUserAgent(navigator.userAgent);
    }

    return { os: osName, osVersion: osVersion || '(maybe)' };
  }

  async getBrowser() {
    let browserName = 'Unknown Browser';
    let browserVersion = '';

    // Use high entropy values if available
    if (navigator.userAgentData) {
      try {
        const highEntropyValues = await navigator.userAgentData.getHighEntropyValues(['fullVersionList']);
        const brandVersion = highEntropyValues.fullVersionList.filter(b => b.brand !== 'Not A;Brand');
        if (brandVersion.length > 0) {
          browserName = brandVersion[0].brand;
          browserVersion = brandVersion[0].version;
        }
      } catch (error) {
        console.error('Error getting high entropy values for browser:', error);
      }
    }

    // Fallback to userAgentData or userAgent string
    if (!browserVersion) {
      ({ browserName, browserVersion } = this.parseBrowserFromUserAgent(navigator.userAgent));
    }

    return { browser: browserName, browserVersion: browserVersion || '(maybe)' };
  }

  async getArch() {
    // Check if the User-Agent Client Hints API is available
    if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      try {
        const { architecture } = await navigator.userAgentData.getHighEntropyValues(['architecture']);
        return architecture || 'Unknown architecture';
      } catch (error) {
        console.error('Error getting high entropy values for architecture:', error);
      }
    }

    // Try to infer architecture from WebGL renderer information
    const archInfo = this.getArchFromWebGL();
    if (archInfo) {
      return archInfo;
    }

    // Fallback to known patterns in userAgent and platform
    const platform = navigator.platform;
    if (platform) {
      if (/Win64|WOW64|x64/.test(platform)) {
        return '64-bit';
      } else if (/Win32|x86/.test(platform)) {
        return '32-bit';
      } else if (/Macintosh/.test(navigator.userAgent) && /Intel/.test(platform)) {
        return 'x86_64 (Intel)'; // Macs that are not ARM but are Intel-based
      }
    }

    // Last resort fallback if no information can be obtained
    return 'Unknown architecture';
  }

  getArchFromWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        return null;
      }
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
        return null;
      }
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

      if (/NVIDIA|AMD|Intel/i.test(renderer)) {
        return '64-bit'; // Most desktop GPUs from these vendors imply a 64-bit system
      } else if (/Apple/.test(vendor)) {
        return 'ARM (Apple Silicon)'; // Apple GPUs on M1/M2 chips
      }
      // Add more specific checks as needed
    } catch (e) {
      console.error('Error getting WebGL renderer info for architecture:', e);
    }
    return null;
  }

  parseOSFromUserAgent(userAgent) {
    // Regular expressions for OS detection
    const osRegexMap = {
      'Windows 10+': /Windows NT 10.0/,
      'Windows 8.1': /Windows NT 6.3/,
      'Windows 8': /Windows NT 6.2/,
      'Windows 7': /Windows NT 6.1/,
      'Windows Vista': /Windows NT 6.0/,
      'Windows XP': /Windows NT 5.1/,
      'macOS': /Macintosh;.*Mac OS X/,
      'iOS': /iPhone;.*OS|iPad;.*OS/,
      'Android': /Android/,
      'Linux': /Linux/,
      'Ubuntu': /Ubuntu/,
      'Debian': /Debian/,
      // Add more OS regex maps as needed
    };

    // Try to match each OS regex
    for (const [os, regex] of Object.entries(osRegexMap)) {
      if (regex.test(userAgent)) {
        return os;
      }
    }

    // Default to a generic message if no OS is detected
    return 'Unknown OS';
  }

  parseBrowserFromUserAgent(userAgent) {
    // Regular expressions for browser detection
    const browserRegexMap = {
      'Chrome': /Chrome\/(\S+)/,
      'Safari': /Version\/(\S+).*Safari/,
      'Firefox': /Firefox\/(\S+)/,
      'Edge': /Edg\/(\S+)/,
      'Internet Explorer': /; MSIE (\S+);/,
      // More browsers can be added here
    };

    let browserName = 'Unknown Browser';
    let browserVersion = '';

    // Try to match each browser regex
    for (const [name, regex] of Object.entries(browserRegexMap)) {
      const match = userAgent.match(regex);
      if (match) {
        browserName = name;
        browserVersion = match[1]; // match[1] contains the version number
        break; // exit the loop once we have a match
      }
    }

    return { browserName, browserVersion };
  }

  getColorDepth(bits) {
    // Mapping of color depths to the number of colors they represent
    const colorDepthMapping = {
      24: '16.7 million', // True Color
      30: '1.07 billion', // 10 bits per channel, no alpha
      32: '16.7 million + alpha', // True Color + alpha channel
      // Add more mappings if necessary
    };

    // Return the human-readable color depth, or calculate if not in the mapping
    return colorDepthMapping[bits] || `${this.convertToHumanReadable(Math.pow(2, bits))} colors`;
  }

  convertToHumanReadable(number) {
    const units = ['', 'thousand', 'million', 'billion', 'trillion'];
    const k = 1000;
    const magnitude = Math.floor(Math.log10(number) / Math.log10(k));
    return `${(number / Math.pow(k, magnitude)).toFixed(1)} ${units[magnitude]}`;
  }

  extractState(data) {
    // Since the profile data doesn't change, we can just return it as is
    return {
      deviceProfile: data
    };
  }
}


