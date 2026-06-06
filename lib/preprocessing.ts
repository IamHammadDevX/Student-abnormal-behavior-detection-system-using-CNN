import * as tf from "@tensorflow/tfjs";

export function preprocessImage(
  imageElement: HTMLImageElement | HTMLCanvasElement
): tf.Tensor4D {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    tensor = tensor.cast("float32");
    return tensor.expandDims(0) as tf.Tensor4D;
  });
}
