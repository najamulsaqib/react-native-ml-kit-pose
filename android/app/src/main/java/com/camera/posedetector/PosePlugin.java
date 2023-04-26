package com.camera.posedetector;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.PointF;
import android.media.Image;

import androidx.annotation.NonNull;
import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.common.PointF3D;
import com.google.mlkit.vision.pose.Pose;
import com.google.mlkit.vision.pose.PoseDetection;
import com.google.mlkit.vision.pose.PoseDetector;
import com.google.mlkit.vision.pose.PoseLandmark;
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

public class PosePlugin extends FrameProcessorPlugin {
    private PoseDetectorOptions options; //= new PoseDetectorOptions.Builder().setDetectorMode(PoseDetectorOptions.STREAM_MODE).build();
    private PoseDetector poseDetector; //= PoseDetection.getClient(options);

    public PosePlugin() {
        super("poseDetection");
        options = new PoseDetectorOptions.Builder().setDetectorMode(PoseDetectorOptions.STREAM_MODE).build();
        poseDetector = PoseDetection.getClient(options);
    }

    @Override
    public Object callback(ImageProxy imageProxy, Object[] params) {

        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = imageProxy.getImage();

        if (mediaImage != null) {
            InputImage image =
                    InputImage.fromMediaImage(mediaImage, 270);
            // Pass image to an ML Kit Vision API
            Task<Pose> result = poseDetector.process(image);

            try {
                WritableNativeMap map = new WritableNativeMap();

                for (PoseLandmark landmark : Tasks.await(result).getAllPoseLandmarks()) {
                    map.putMap(getLandmarkType(landmark.getLandmarkType()), point3DToMap(landmark.getPosition3D(), landmark.getInFrameLikelihood()));
                }
                return map;

            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        // code here.
        return null;
    }

    String getLandmarkType(int landmarkType) {
        switch (landmarkType) {

            case PoseLandmark.LEFT_ELBOW:
                return "leftElbow";
            case PoseLandmark.LEFT_ANKLE:
                return "leftAnkle";
            case PoseLandmark.LEFT_HIP:
                return "leftHip";
            case PoseLandmark.LEFT_KNEE:
                return "leftKnee";
            case PoseLandmark.LEFT_SHOULDER:
                return "leftShoulder";
            case PoseLandmark.LEFT_WRIST:
                return "leftWrist";
            case PoseLandmark.RIGHT_ANKLE:
                return "rightAnkle";
            case PoseLandmark.RIGHT_ELBOW:
                return "rightElbow";
            case PoseLandmark.RIGHT_HIP:
                return "rightHip";
            case PoseLandmark.RIGHT_KNEE:
                return "rightKnee";
            case PoseLandmark.RIGHT_SHOULDER:
                return "rightShoulder";
            case PoseLandmark.RIGHT_WRIST:
                return "rightWrist";
            case PoseLandmark.LEFT_PINKY:
                return "leftPinky";
            case PoseLandmark.LEFT_INDEX:
                return "leftIndex";
            case PoseLandmark.LEFT_THUMB:
                return "leftThumb";
            case PoseLandmark.LEFT_HEEL:
                return "leftHeel";
            case PoseLandmark.LEFT_FOOT_INDEX:
                return "leftFootIndex";
            case PoseLandmark.RIGHT_PINKY:
                return "rightPinky";
            case PoseLandmark.RIGHT_INDEX:
                return "rightIndex";
            case PoseLandmark.RIGHT_THUMB:
                return "rightThumb";
            case PoseLandmark.RIGHT_HEEL:
                return "rightHeel";
            case PoseLandmark.RIGHT_FOOT_INDEX:
                return "rightFootIndex";
            default:
                return "";
        }
    }

    WritableNativeMap pointToMap(@NonNull PointF point, @NonNull float visibility) {
        WritableNativeMap result = new WritableNativeMap();
        result.putDouble("x", point.x);
        result.putDouble("y", point.y);
        result.putDouble("visibility", visibility);
        return result;
    }

    WritableNativeMap point3DToMap(@NonNull PointF3D point, @NonNull float visibility) {
        WritableNativeMap result = new WritableNativeMap();
        result.putDouble("x", point.getX());
        result.putDouble("y", point.getY());
        result.putDouble("z", point.getZ());
        result.putDouble("visibility", visibility);
        return result;
    }

}
