import React from 'react';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function PadLockIcon({ color, size }: Props) {
  return (
    <Svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/Svg" width={size} height={size}>
      <Rect x="4.5" y="8" width="11" height="9" rx="2" stroke={color} strokeWidth="1.25" />
      <Circle cx="10" cy="11.5" r="0.5" stroke={color} strokeWidth="1.25" />
      <Path d="M10 14V11.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <Path d="M7 7.5V5.5C7 3.84315 8.34315 2.5 10 2.5V2.5C11.6569 2.5 13 3.84315 13 5.5V7.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </Svg>
  );
}
