import Alpine from "alpinejs";

/**
 * Theme component for Alpine.js
 */
class ThemeComponent {
    constructor() {
        this.isDark = localStorage.getItem('color-theme') === 'dark'
            || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    init() {
        // Set the initial theme.
        this.updateTheme();

        // Watch for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!('color-theme' in localStorage)) {
                this.isDark = e.matches;
                this.updateTheme();
            }
        });
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.updateTheme();
    }

    updateTheme() {
        if (this.isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    }
}

/**
 * Dropdown component for Alpine.js
 */
class DropdownComponent {
    constructor() {
        this.open = false;
    }

    onButtonClick() {
        if (this.open) {
            return this.close();
        }

        this.$refs.button.focus();
        this.open = true;
    }

    onClickAway() {
        this.close();
    }

    close(focusAfter) {
        if (!this.open) {
            return;
        }

        this.open = false;

        if (focusAfter) {
            focusAfter.focus();
        }
    }
}

/**
 * Tabs component for Alpine.js
 */
class TabsComponent {
    constructor() {
        this.tabs = [];
        this.activeTab = 0;
        this.userOS = this.detectOS();
    }

    detectOS() {
        const platform = navigator.userAgent.toLowerCase();

        if (platform.includes('win')) {
            return 'windows';
        }
        else if (platform.includes('mac')) {
            return 'macos';
        }
        else if (platform.includes('linux')) {
            return 'linux';
        }
        else {
            return 'unknown';
        }
    }

    init() {
        // Find all tab contents within this container.
        const tabContents = this.$el.querySelectorAll('.tabs-content > .tab-content');

        // Create tab data from tab contents.
        this.tabs = Array.from(tabContents).map((content, index) => {
            // Hide all tabs except the first one.
            if (index !== 0) {
                content.classList.add('hidden');
            }

            return {
                name: content.getAttribute('data-tab-name'), 
                index: index,
                os: content.getAttribute('data-tab-os')
            };
        });

        // Check if this is a platform-specific tab group.
        const hasPlatformTabs = this.tabs.some(tab => tab.os);

        // If we have platform tabs, try to select the one matching the user's OS.
        if (hasPlatformTabs) {
            const osTab = this.tabs.findIndex(tab => tab.os && tab.os.toLowerCase() === this.userOS);
            if (osTab !== -1) {
                this.activeTab = osTab;

                // Hide all tabs except the OS-specific one.
                tabContents.forEach((content, index) => {
                    if (index !== osTab) {
                        content.classList.add('hidden');
                    }
                    else {
                        content.classList.remove('hidden');
                    }
                });
            }
        }

        // Watch for changes to activeTab.
        this.$watch('activeTab', (value) => {
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show the active tab content.
            tabContents[value].classList.remove('hidden');
        });
    }
}

/**
 * DownloadVersion component for Alpine.js
 */
class DownloadVersion {
    constructor() {
        this.olderVersionsVisible = {};
        this.openVersions = {};
    }

    init() {
        // Initialize the component
        // Set the first version of each platform as open by default
        document.querySelectorAll('.version-header').forEach(header => {
            if (header.getAttribute('data-version-index') === '0') {
                const versionId = header.getAttribute('data-version-id');
                this.openVersions[versionId] = true;
            }
        });
    }

    toggleVersion(versionId) {
        // Toggle the open state
        this.openVersions[versionId] = !this.openVersions[versionId];
    }

    isVersionOpen(versionId) {
        return this.openVersions[versionId] || false;
    }

    showMoreVersions(platformIndex) {
        // Show all older versions for this platform
        const tabContent = document.querySelector(`.tab-content:nth-child(${parseInt(platformIndex) + 1})`);
        tabContent.querySelectorAll('.older-version').forEach(version => {
            version.classList.remove('hidden');
        });

        // Update state
        this.olderVersionsVisible[platformIndex] = true;
    }

    showLessVersions(platformIndex) {
        // Hide all older versions for this platform
        const tabContent = document.querySelector(`.tab-content:nth-child(${parseInt(platformIndex) + 1})`);
        tabContent.querySelectorAll('.older-version').forEach(version => {
            version.classList.add('hidden');
        });

        // Update state
        this.olderVersionsVisible[platformIndex] = false;
    }

    isOlderVersionsVisible(platformIndex) {
        return this.olderVersionsVisible[platformIndex] || false;
    }
}

/**
 * Application initialization class.
 */
class App {
    constructor() {
        this.initAlpine();
    }

    initAlpine() {
        // Register Alpine data components.
        Alpine.data("dropdown", () => new DropdownComponent());
        Alpine.data("tabs", () => new TabsComponent());
        Alpine.data("versions", () => new DownloadVersion());
        Alpine.data("theme", () => new ThemeComponent());

        // Make Alpine globally available.
        window.Alpine = Alpine;

        // Initialize Alpine.
        Alpine.start();
    }
}

// Initialize the application.
new App();
