package com.camera.posedetector;

import android.annotation.SuppressLint;
import android.graphics.PointF;
import android.media.Image;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.gson.Gson;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.common.PointF3D;
import com.google.mlkit.vision.pose.Pose;
import com.google.mlkit.vision.pose.PoseDetection;
import com.google.mlkit.vision.pose.PoseDetector;
import com.google.mlkit.vision.pose.PoseLandmark;
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PosePlugin extends FrameProcessorPlugin {
    private PoseDetectorOptions options = new PoseDetectorOptions.Builder().setDetectorMode(PoseDetectorOptions.STREAM_MODE).build();
    private PoseDetector poseDetector = PoseDetection.getClient(options);

    @Override
    public Object callback(ImageProxy imageProxy, Object[] params) {

        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = imageProxy.getImage();

        if (mediaImage != null) {
            List<PoseLandmark> landmarks = new ArrayList<PoseLandmark>();

            InputImage image =
                    InputImage.fromMediaImage(mediaImage, imageProxy.getImageInfo().getRotationDegrees());
            // Pass image to an ML Kit Vision API
            Task<Pose> result = poseDetector.process(image);

            try {
                WritableNativeMap map = new WritableNativeMap();

                for (PoseLandmark landmark : Tasks.await(result).getAllPoseLandmarks()) {
                    map.putMap(getLandmarkType(landmark.getLandmarkType()), pointToMap(landmark.getPosition()));
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
            case PoseLandmark.LEFT_EYE:
                return "LEFT_EYE";
            case PoseLandmark.LEFT_EYE_INNER:
                return "LEFT_EYE_INNER";
            case PoseLandmark.LEFT_EYE_OUTER:
                return "LEFT_EYE_OUTER";
            case PoseLandmark.RIGHT_EYE:
                return "RIGHT_EYE";
            case PoseLandmark.RIGHT_EYE_INNER:
                return "RIGHT_EYE_INNER";
            case PoseLandmark.RIGHT_EYE_OUTER:
                return "RIGHT_EYE_OUTER";
            case PoseLandmark.LEFT_EAR:
                return "LEFT_EAR";
            case PoseLandmark.RIGHT_EAR:
                return "RIGHT_EAR";
            case PoseLandmark.NOSE:
                return "NOSE";
            case PoseLandmark.LEFT_MOUTH:
                return "LEFT_MOUTH";
            case PoseLandmark.RIGHT_MOUTH:
                return "RIGHT_MOUTH";
            case PoseLandmark.LEFT_SHOULDER:
                return "LEFT_SHOULDER";
            case PoseLandmark.RIGHT_SHOULDER:
                return "RIGHT_SHOULDER";
            case PoseLandmark.LEFT_ELBOW:
                return "LEFT_ELBOW";
            case PoseLandmark.RIGHT_ELBOW:
                return "RIGHT_ELBOW";
            case PoseLandmark.LEFT_WRIST:
                return "LEFT_WRIST";
            case PoseLandmark.RIGHT_WRIST:
                return "RIGHT_WRIST";
            case PoseLandmark.LEFT_THUMB:
                return "LEFT_THUMB";
            case PoseLandmark.RIGHT_THUMB:
                return "RIGHT_THUMB";
            case PoseLandmark.LEFT_PINKY:
                return "LEFT_PINKY";
            case PoseLandmark.RIGHT_PINKY:
                return "RIGHT_PINKY";
            case PoseLandmark.LEFT_HIP:
                return "LEFT_HIP";
            case PoseLandmark.RIGHT_HIP:
                return "RIGHT_HIP";
            case PoseLandmark.LEFT_KNEE:
                return "LEFT_KNEE";
            case PoseLandmark.RIGHT_KNEE:
                return "RIGHT_KNEE";
            case PoseLandmark.LEFT_HEEL:
                return "LEFT_HEEL";
            case PoseLandmark.RIGHT_HEEL:
                return "RIGHT_HEEL";
            case PoseLandmark.LEFT_FOOT_INDEX:
                return "LEFT_FOOT_INDEX";
            case PoseLandmark.RIGHT_FOOT_INDEX:
                return "RIGHT_FOOT_INDEX";
            default:
                return "";
        }
    }

    WritableNativeMap pointToMap(@NonNull PointF point) {
        WritableNativeMap result = new WritableNativeMap();
        result.putDouble("x", point.x);
        result.putDouble("y", point.y);
        return result;
    }

    Map<String, Object> point3DToMap(@NonNull PointF3D point) {
        Map<String, Object> result = new HashMap<>();
        result.put("x", point.getX());
        result.put("y", point.getY());
        result.put("z", point.getZ());
        return result;
    }

    PosePlugin() {
        super("poseDetection");
    }
}
