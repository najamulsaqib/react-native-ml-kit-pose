/* eslint-disable react-native/no-inline-styles */
import {
  Canvas,
  Circle as SkiaCircle,
  Line as SkiaLine,
  useSharedValueEffect,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {
  ILineWithCircles,
  IPoseLandmarks,
  ISkeleton,
  tusePositionDerivedValue,
  tusePositionSkia,
} from '../index.d';

const pairs: [keyof IPoseLandmarks, keyof IPoseLandmarks][] = [
  ['landmark_11', 'landmark_12'],
  ['landmark_11', 'landmark_13'],
  ['landmark_13', 'landmark_15'],
  ['landmark_12', 'landmark_14'],
  ['landmark_14', 'landmark_16'],
  ['landmark_11', 'landmark_23'],
  ['landmark_12', 'landmark_24'],
  ['landmark_23', 'landmark_24'],
  ['landmark_23', 'landmark_25'],
  ['landmark_24', 'landmark_26'],
  ['landmark_26', 'landmark_28'],
  ['landmark_25', 'landmark_27'],
];

const usePositionSkia: tusePositionSkia = (pose, landmark1, landmark2) => {
  const p1 = useValue(vec(0, 0));
  const p2 = useValue(vec(0, 0));
  const display = useValue(0);

  useSharedValueEffect(() => {
    const visibility1 = pose.value[landmark1].visibility;
    const visibility2 = pose.value[landmark2].visibility;
    p1.current = vec(pose.value[landmark1].x, pose.value[landmark1].y);
    p2.current = vec(pose.value[landmark2].x, pose.value[landmark2].y);
    display.current = visibility1 > 0.6 && visibility2 > 0.6 ? 1 : 0;
  }, pose);
  return { p1, p2, display };
};

const usePositionDerivedValue: tusePositionDerivedValue = (pose, landmark) => {
  const cx = useValue(0);
  const cy = useValue(0);
  const opacity = useValue(0);

  useSharedValueEffect(() => {
    cx.current = pose.value[landmark].x;
    cy.current = pose.value[landmark].y;
    opacity.current = pose.value[landmark].visibility > 0.6 ? 1 : 0;
  }, pose);

  return { cx, cy, opacity };
};

const LineWithCirclesSkia: React.FC<ILineWithCircles> = ({
  pose,
  landmark1,
  landmark2,
}) => {
  const landmark1CircleProps = usePositionDerivedValue(pose, landmark1);
  const landmark2CircleProps = usePositionDerivedValue(pose, landmark2);
  // const color1 = landmark1.startsWith('left') ? 'green' : 'orange';
  // const color2 = landmark2.startsWith('left') ? 'green' : 'orange';
  const path = usePositionSkia(pose, landmark1, landmark2);
  return (
    <>
      <SkiaLine
        p1={path.p1}
        p2={path.p2}
        color="#ffee"
        opacity={path.display}
        style="stroke"
        strokeWidth={2}
      />
      <SkiaCircle
        r={5}
        cx={landmark1CircleProps.cx}
        cy={landmark1CircleProps.cy}
        opacity={landmark1CircleProps.opacity}
        color={'orange'}
      />
      <SkiaCircle
        r={5}
        opacity={landmark2CircleProps.opacity}
        cx={landmark2CircleProps.cx}
        cy={landmark2CircleProps.cy}
        color={'orange'}
      />
    </>
  );
};

const Skeleton: ISkeleton = ({ pose }) => {
  const positions = pairs.map(([landmark1, landmark2]) => ({
    landmark1,
    landmark2,
  }));
  const values = React.useMemo(() => Object.values(positions), [positions]);
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
      }}>
      {React.Children.toArray(
        values.map(({ landmark1, landmark2 }) => (
          <LineWithCirclesSkia
            landmark1={landmark1 as keyof IPoseLandmarks}
            landmark2={landmark2 as keyof IPoseLandmarks}
            pose={pose}
          />
        )),
      )}
    </Canvas>
  );
};

export default Skeleton;
