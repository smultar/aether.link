const config =
{   
    appearance: {
        theme: 'dark', // dark, light, custom
        fontSize: 'normal', // normal, medium, large
        fontFamily: 'Roboto', // Roboto, Arial, sans-serif
        blur: true, // true, false
        animations: true, // true, false
        
        custom: {
            primary: '#00bcd4',
            secondary: '#00bcd4',
            accent: '#00bcd4',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3',
            success: '#4caf50'
        }
    },

    // General
    general: { 
        // Check for updates
        update: {
            auto: true,
            interval: '10 mins', // 60 mins, 30 mins, 15 min
            channel: 'stable', // stable, beta, canary
            check: true,
        },

        // Save the file automatically
        autoSave: {     
            enabled: true,
            interval: '10 mins', // 60 mins, 30 mins, 15 min
            location: '~/Documents/',
            pattern: '{filename}{time}{mark}',
        },

        notification: {
            enabled: true,
        }
    }
}