import * as tf from "@tensorflow/tfjs";

class ModelLoader {
  private static instance: ModelLoader;
  private model: tf.LayersModel | null = null;

  private constructor() {}

  static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  async loadModel(): Promise<tf.LayersModel> {
    if (this.model) {
      return this.model;
    }

    tf.env().set("WEBGL_PACK", false);

    this.model = await tf.loadLayersModel("/model/model.json");
    return this.model;
  }

  getModel(): tf.LayersModel | null {
    return this.model;
  }

  isLoaded(): boolean {
    return this.model !== null;
  }

  async warmup(): Promise<void> {
    if (!this.model) return;
    const dummy = tf.zeros([1, 224, 224, 3]);
    const result = this.model.predict(dummy) as tf.Tensor;
    await result.data();
    result.dispose();
    dummy.dispose();
  }
}

export default ModelLoader;
