/**
 * CREX Design System Configuration
 * Color palettes and styling helpers matching CREX UI
 */

export const CREX_COLORS = {
    navy: '#0b1629',
    teal: '#00D1B2',
    wide: '#FAD331',
    wkt: '#FF3860',
    boundary4: '#3273DC',
    boundary6: '#48C774',
    dot: '#7F8C8D',
    gray: {
        100: '#F5F6F7',
        200: '#E1E4E8',
        300: '#D1D5DA',
        400: '#959DA5',
        500: '#6A737D',
        600: '#586069',
        700: '#444D56',
        800: '#2F363D',
        900: '#24292E',
    },
}

export type BallColorInput = {
    value: string
    type: string
    runsOffBat?: number
}

export const getBallColor = (ball: BallColorInput): string => {
    const val = ball.value.toLowerCase()
    const type = ball.type.toLowerCase()

    if (val.includes('w')) return CREX_COLORS.wkt
    if (val.includes('4')) return CREX_COLORS.boundary4
    if (val.includes('6')) return CREX_COLORS.boundary6
    if (type === 'wide' || type === 'no-ball') return CREX_COLORS.wide
    if (val === '0') return CREX_COLORS.dot

    return CREX_COLORS.navy
}
