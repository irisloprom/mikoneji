import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../styles/globalStyles';

interface OtpInputProps {
  codeLength?: number;
  onCodeFilled: (code: string) => void;
}

export const OtpInput = ({ codeLength = 6, onCodeFilled }: OtpInputProps) => {
  const [code, setCode] = useState<string[]>(new Array(codeLength).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      onCodeFilled(newCode.join(''));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          style={styles.inputBox}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputBox: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: SIZES.titleXL,
    fontFamily: FONTS.body,
    color: COLORS.textDark,
  },
});