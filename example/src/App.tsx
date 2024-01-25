import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export default function App() {
  const permission = useCameraPermission();
  const device = useCameraDevice('back');

  React.useEffect(() => {
    permission.requestPermission();
  }, [permission]);

  const plugin = useResizePlugin();

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    console.log(frame.toString());

    const start = performance.now();

    const targetWidth = 100;
    const targetHeight = 100;

    const result = plugin.resize(frame, {
      size: {
        // Center-crop
        x: frame.width / 2 - targetWidth / 2,
        y: frame.height / 2 - targetHeight / 2,
        width: targetWidth,
        height: targetHeight,
      },
      pixelFormat: 'argb',
      dataType: 'uint8',
    });
    console.log(
      result[0],
      result[1],
      result[2],
      result[3],
      '(' + result.length + ')'
    );

    const end = performance.now();

    console.log(
      `Resized ${frame.width}x${frame.height} into 100x100 frame (${
        result.length
      }) in ${(end - start).toFixed(2)}ms`
    );
  }, []);

  return (
    <View style={styles.container}>
      {permission.hasPermission && device != null && (
        <Camera
          device={device}
          style={StyleSheet.absoluteFill}
          isActive={true}
          pixelFormat="yuv"
          frameProcessor={frameProcessor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
