import React from 'react';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function PadLockOpenIcon({ color, size }: Props) {
  return (
    <Svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/Svg" width={size} height={size}>
      <Rect x="4.5" y="8" width="11" height="9" rx="2" stroke={color} strokeWidth="1.25">
      </Rect>
      <Circle cx="10" cy="11.5" r="0.5" stroke={color} strokeWidth="1.25">
      </Circle>
      <Path d="M10 14V11.5" stroke={color} strokeWidth="1.25" strokeLinecap="round">
      </Path>
      <Path d="M19 6V4C19 2.34315 17.6569 1 16 1V1C14.3431 1 13 2.34315 13 4V8" stroke={color} strokeWidth="1.25" strokeLinecap="round">
      </Path>
    </Svg>
  );
}
