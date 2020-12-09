function pad(width, str, padding) { 
    return (width <= str.length) ? str : pad(width, padding + str, padding)
 }

