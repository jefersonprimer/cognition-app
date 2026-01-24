import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function StarSlashIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="m4.897 3.085-.122-.142a.625.625 0 0 0-.95.814l3.18 3.71h-3.98a.625.625 0 0 0-.367 1.13L6.6 11.462l-1.506 4.636a.625.625 0 0 0 .962.699L10 13.932l3.943 2.865a.625.625 0 0 0 .903-.183l1.215 1.418a.625.625 0 0 0 .95-.814l-.495-.576a.6.6 0 0 1-.127-.113l-11.4-13.3a.6.6 0 0 1-.093-.144m.051 5.632h3.129l5.018 5.853.027.085-2.755-2.001a.625.625 0 0 0-.734 0l-2.755 2.001 1.052-3.238a.625.625 0 0 0-.227-.699zm8.633 2.613 3.762-2.733a.625.625 0 0 0-.367-1.13H12.1L10.594 2.83a.625.625 0 0 0-1.188 0L8.55 5.463l.953 1.112L10 5.047l1.052 3.238a.625.625 0 0 0 .595.432h3.404l-2.287 1.662z">
      </Path>
    </Svg>
  );
}
