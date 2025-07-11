/**
 * CookieBanner Styles Module
 * Централизованные стили для CookieBanner компонента
 */

export const DESIGN_TOKENS = {
  colors: {
    background: '#ffffff',
    backgroundDark: '#1a202c',
    text: '#2d3748',
    textLight: '#4a5568',
    textDark: '#e2e8f0',
    primary: '#3182ce',      // Accept button
    primaryHover: '#2c5aa0',
    secondary: '#e2e8f0',    // Decline button
    secondaryHover: '#cbd5e0',
    accent: '#805ad5',       // Customize button
    accentHover: '#6b46c1',
    border: '#e2e8f0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#38a169',
    warning: '#d69e2e'
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: '8px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  zIndex: {
    banner: 9999,
    modal: 10000
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export const getStyles = (theme = 'light') => {
  const tokens = DESIGN_TOKENS;
  const isDark = theme === 'dark';
  
  return {
    banner: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: isDark ? tokens.colors.backgroundDark : tokens.colors.background,
      color: isDark ? tokens.colors.textDark : tokens.colors.text,
      borderTop: `1px solid ${tokens.colors.border}`,
      padding: tokens.spacing.lg,
      boxShadow: tokens.boxShadow,
      zIndex: tokens.zIndex.banner,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      transform: 'translateY(100%)',
      transition: `transform ${tokens.transitions.normal}`,
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    
    bannerVisible: {
      transform: 'translateY(0)'
    },
    
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacing.md,
      maxWidth: '1200px',
      margin: '0 auto'
    },
    
    content: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.sm
    },
    
    title: {
      fontSize: '16px',
      fontWeight: '600',
      margin: '0',
      color: isDark ? tokens.colors.textDark : tokens.colors.text
    },
    
    description: {
      fontSize: '14px',
      margin: '0',
      color: isDark ? tokens.colors.textLight : tokens.colors.textLight,
      lineHeight: '1.4'
    },
    
    buttons: {
      display: 'flex',
      gap: tokens.spacing.sm,
      flexShrink: '0'
    },
    
    button: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      border: 'none',
      borderRadius: tokens.borderRadius,
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: `all ${tokens.transitions.fast}`,
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '36px',
      textDecoration: 'none'
    },
    
    buttonPrimary: {
      backgroundColor: tokens.colors.primary,
      color: 'white',
      ':hover': {
        backgroundColor: tokens.colors.primaryHover
      }
    },
    
    buttonSecondary: {
      backgroundColor: tokens.colors.secondary,
      color: tokens.colors.text,
      ':hover': {
        backgroundColor: tokens.colors.secondaryHover
      }
    },
    
    buttonAccent: {
      backgroundColor: tokens.colors.accent,
      color: 'white',
      ':hover': {
        backgroundColor: tokens.colors.accentHover
      }
    },
    
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: tokens.colors.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: tokens.zIndex.modal,
      opacity: '0',
      visibility: 'hidden',
      transition: `opacity ${tokens.transitions.normal}, visibility ${tokens.transitions.normal}`
    },
    
    modalVisible: {
      opacity: '1',
      visibility: 'visible'
    },
    
    modalContent: {
      backgroundColor: isDark ? tokens.colors.backgroundDark : tokens.colors.background,
      borderRadius: tokens.borderRadius,
      padding: tokens.spacing.xl,
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: tokens.boxShadow,
      transform: 'scale(0.9)',
      transition: `transform ${tokens.transitions.normal}`
    },
    
    modalContentVisible: {
      transform: 'scale(1)'
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.lg
    },
    
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: '0',
      color: isDark ? tokens.colors.textDark : tokens.colors.text
    },
    
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: isDark ? tokens.colors.textLight : tokens.colors.textLight,
      padding: '0',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: `background-color ${tokens.transitions.fast}`,
      ':hover': {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
      }
    },
    
    category: {
      marginBottom: tokens.spacing.lg,
      padding: tokens.spacing.md,
      border: `1px solid ${tokens.colors.border}`,
      borderRadius: tokens.borderRadius,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
    },
    
    categoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm
    },
    
    categoryTitle: {
      fontSize: '16px',
      fontWeight: '500',
      margin: '0',
      color: isDark ? tokens.colors.textDark : tokens.colors.text
    },
    
    categoryDescription: {
      fontSize: '14px',
      margin: '0',
      color: isDark ? tokens.colors.textLight : tokens.colors.textLight,
      lineHeight: '1.4'
    },
    
    toggle: {
      position: 'relative',
      width: '44px',
      height: '24px',
      backgroundColor: isDark ? tokens.colors.textLight : tokens.colors.border,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: `background-color ${tokens.transitions.fast}`,
      border: 'none',
      padding: '0'
    },
    
    toggleActive: {
      backgroundColor: tokens.colors.primary
    },
    
    toggleThumb: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: `transform ${tokens.transitions.fast}`,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    
    toggleThumbActive: {
      transform: 'translateX(20px)'
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.xl,
      paddingTop: tokens.spacing.lg,
      borderTop: `1px solid ${tokens.colors.border}`
    },
    
    link: {
      color: tokens.colors.primary,
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    
    srOnly: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0'
    }
  };
};

export const applyStyles = (element, styles) => {
  if (!element || !styles) return;
  
  Object.keys(styles).forEach(property => {
    if (styles[property] !== null && styles[property] !== undefined) {
      element.style[property] = styles[property];
    }
  });
};

export const addHoverEffects = (button) => {
  if (!button) return;
  
  const originalBackground = button.style.backgroundColor;
  const originalColor = button.style.color;
  
  button.addEventListener('mouseenter', () => {
    if (button.classList.contains('primary')) {
      button.style.backgroundColor = DESIGN_TOKENS.colors.primaryHover;
    } else if (button.classList.contains('secondary')) {
      button.style.backgroundColor = DESIGN_TOKENS.colors.secondaryHover;
    } else if (button.classList.contains('accent')) {
      button.style.backgroundColor = DESIGN_TOKENS.colors.accentHover;
    }
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = originalBackground;
    button.style.color = originalColor;
  });
}; 