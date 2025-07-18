/**
 * Medical Image Viewer 2 - Theme System
 * 
 * This file contains the theme definitions and theme switching functionality.
 *
 * To create a custom theme:
 * 1. Add a new theme object to the `themes` object
 * 2. Follow the existing theme structure as shown below:
 *
 * ```
 * myCustomTheme: {
 *   name: "My Custom Theme",
 *   colors: {
 *     accentPrimary: "#hexcolor",
 *     accentSecondary: "#hexcolor",
 *     bgLight: "#hexcolor",
 *     bgMain: "#hexcolor",
 *     bgContent: "#hexcolor",
 *     border: "#hexcolor",
 *     textDark: "#hexcolor",
 *     textMuted: "#hexcolor",
 *     textLight: "#hexcolor",
 *     error: "#hexcolor",
 *     headerBg: "#hexcolor"
 *   },
 *   shadows: {
 *     sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
 *     md: "0 2px 6px rgba(0, 0, 0, 0.12)"
 *   },
 *   radius: {
 *     sm: "4px",
 *     md: "6px"
 *   }
 * }
 * ```
 *
 * The theme will automatically appear in the theme selector dropdown.
 */

const themes = {
  // Default theme
  default: {
    name: "Default",
    colors: {
      accentPrimary: "#0063B3",
      accentSecondary: "#00A3B8",
      bgLight: "#F8FAFC",
      bgMain: "#F0F2F5",
      bgContent: "#FFFFFF",
      border: "#CCD2D9",
      textDark: "#16253B",
      textMuted: "#5A6A7E",
      textLight: "#FFFFFF",
      error: "#D32F2F",
      headerBg: "#E7EBF0"
    },
    shadows: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
      md: "0 2px 6px rgba(0, 0, 0, 0.12)"
    },
    radius: {
      sm: "4px",
      md: "6px"
    }
  },
  
  // Dark theme
  dark: {
    name: "Dark",
    colors: {
      accentPrimary: "#2196F3",
      accentSecondary: "#03DAC6",
      bgLight: "#2D3748",
      bgMain: "#1A202C",
      bgContent: "#2D3748",
      border: "#4A5568",
      textDark: "#E2E8F0",
      textMuted: "#A0AEC0",
      textLight: "#FFFFFF",
      error: "#F56565",
      headerBg: "#171923"
    },
    shadows: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.3)",
      md: "0 2px 6px rgba(0, 0, 0, 0.4)"
    },
    radius: {
      sm: "4px",
      md: "6px"
    }
  },
  
  // High contrast theme
  highContrast: {
    name: "High Contrast",
    colors: {
      accentPrimary: "#FFFF00",
      accentSecondary: "#00FFFF",
      bgLight: "#000000",
      bgMain: "#333333",
      bgContent: "#000000",
      border: "#FFFFFF",
      textDark: "#FFFFFF",
      textMuted: "#FFFFFF",
      textLight: "#000000",
      error: "#FF0000",
      headerBg: "#000000"
    },
    shadows: {
      sm: "0 0 0 1px #FFFFFF",
      md: "0 0 0 2px #FFFFFF"
    },
    radius: {
      sm: "0",
      md: "0"
    }
  }
};

let currentTheme = "default";

function applyTheme(themeName) {
  const theme = themes[themeName] || themes.default;

  document.documentElement.style.setProperty('--color-accent-primary', theme.colors.accentPrimary);
  document.documentElement.style.setProperty('--color-accent-secondary', theme.colors.accentSecondary);
  document.documentElement.style.setProperty('--color-bg-light', theme.colors.bgLight);
  document.documentElement.style.setProperty('--color-bg-main', theme.colors.bgMain);
  document.documentElement.style.setProperty('--color-bg-content', theme.colors.bgContent);
  document.documentElement.style.setProperty('--color-border', theme.colors.border);
  document.documentElement.style.setProperty('--color-text-dark', theme.colors.textDark);
  document.documentElement.style.setProperty('--color-text-muted', theme.colors.textMuted);
  document.documentElement.style.setProperty('--color-text-light', theme.colors.textLight);
  document.documentElement.style.setProperty('--color-error', theme.colors.error);
  document.documentElement.style.setProperty('--color-header-bg', theme.colors.headerBg);
  
  document.documentElement.style.setProperty('--shadow-sm', theme.shadows.sm);
  document.documentElement.style.setProperty('--shadow-md', theme.shadows.md);
  
  document.documentElement.style.setProperty('--radius-sm', theme.radius.sm);
  document.documentElement.style.setProperty('--radius-md', theme.radius.md);

  document.documentElement.setAttribute('data-theme', themeName);

  currentTheme = themeName;
  localStorage.setItem('miv2-theme', themeName);
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    themeSelector.value = themeName;
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('miv2-theme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  } else {
    applyTheme('default');
  }
}

function createThemeSelector() {
  const themeSelector = document.createElement('select');
  themeSelector.id = 'themeSelector';
  themeSelector.className = 'miv2-theme-selector';
  themeSelector.setAttribute('aria-label', 'Select theme');

  Object.keys(themes).forEach(themeKey => {
    const option = document.createElement('option');
    option.value = themeKey;
    option.textContent = themes[themeKey].name;
    themeSelector.appendChild(option);
  });

  themeSelector.value = currentTheme;

  themeSelector.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
  
  return themeSelector;
}

// Export functions
window.miv2Themes = {
  applyTheme,
  initializeTheme,
  createThemeSelector,
  getThemes: () => Object.keys(themes).map(key => ({ id: key, name: themes[key].name }))
};