import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, DimensionValue } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface CustomDropdownProps {
    data: { label: string; value: string }[];
    placeholder?: string;
    value: string | null;
    onChange: (item: { label: string; value: string }) => void;
    width?: DimensionValue;
    height?: DimensionValue;
    maxHeight?: DimensionValue;
    fontBold?: boolean;
    style?: StyleProp<ViewStyle>;
    dropdownStyle?: StyleProp<ViewStyle>;
    placeholderStyle?: StyleProp<TextStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    data,
    placeholder = 'Select an item',
    value,
    onChange,
    width = 200,
    height = 40, // Increased height
    maxHeight = 40, // Increased maxHeight
    fontBold = false,
    style,
    dropdownStyle,
    placeholderStyle,
    selectedTextStyle,
}) => {
    const { width: styleWidth, height: styleHeight, maxHeight: styleMaxHeight } = StyleSheet.flatten(style || {}) as ViewStyle;

    return (
        <View style={[styles.container, style]}>
            <Dropdown
                style={[
                    styles.dropdown,
                    dropdownStyle,
                    {
                        width: styleWidth || width,
                        height: styleHeight || height,
                        maxHeight: styleMaxHeight || maxHeight,
                    },
                ]}
                placeholderStyle={[
                    styles.placeholderStyle,
                    placeholderStyle,
                    fontBold && styles.boldText,
                ]}
                selectedTextStyle={[
                    styles.selectedTextStyle,
                    selectedTextStyle,
                    fontBold && styles.boldText,
                ]}
                data={data}
                placeholder={placeholder}
                labelField="label"
                valueField="value"
                value={value}
                onChange={onChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginLeft: 10,
        height: 40,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default CustomDropdown;