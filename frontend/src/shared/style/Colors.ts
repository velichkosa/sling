export const themes = {
    light: {

    },
    dark: {
        searchBox: {
            background: 'rgba(255, 255, 255, 0.1)',
            input: 'white',
            placeholder: 'rgba(255, 255, 255, 0.5)',
            searchIcon: 'white',
            clearIcon: 'white',
            dropdownItem: '#020202',
            dropdownBackground: 'rgba(255, 255, 255, 0.1)',
            dropdownBoxShadow: '0 -4px 10px rgba(255, 255, 255, 0.2)'  /* Тень вверх */
        },
        footer: {
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white'
        }
    },
} as const;