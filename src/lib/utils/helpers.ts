export const capitalize = (str: string) => {
    return (str && str[0].toUpperCase() + str.slice(1).toLowerCase()) || '';
};
