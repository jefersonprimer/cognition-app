import React from 'react';
import { View } from 'react-native';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
  withBorder?: boolean; 
};

export function PlusSmallIcon({ color, size, withBorder = false }: Props) {
  const borderSize = size; // opcional, ajusta o tamanho do círculo em volta

  return (
    <View
      style={
        withBorder
          ? {
              width: borderSize,
              height: borderSize,
              borderRadius: borderSize / 2,
              borderWidth: 1,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : undefined
      }
    >
      <Svg
        aria-hidden="true"
        role="graphics-symbol"
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill={color}
      >
        <Path d="M8 2.74a.66.66 0 0 1 .66.66v3.94h3.94a.66.66 0 0 1 0 1.32H8.66v3.94a.66.66 0 0 1-1.32 0V8.66H3.4a.66.66 0 0 1 0-1.32h3.94V3.4A.66.66 0 0 1 8 2.74" />
      </Svg>
    </View>
  );
}

