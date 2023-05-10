//
//  PoseDetection.m
//  Camera
//
//  Created by Najam Ul Saqib on 11/04/2023.
//

#import <Foundation/Foundation.h>
#import "PoseDetection.h"
#import <UIKit/UIImage.h>
#import <CoreMedia/CMSampleBuffer.h>
#import <VisionCamera/Frame.h>
#import <MLKit.h>
#import <AVFoundation/AVCaptureDevice.h>

@implementation PoseDetection : NSObject

static MLKPoseDetectorOptions *options;
static MLKPoseDetector *poseDetector;

+ (void)initialize {
  // Initialize the pose detector options and detector objects
  options = [[MLKPoseDetectorOptions alloc] init];
  options.detectorMode = MLKPoseDetectorModeStream;
  poseDetector = [MLKPoseDetector poseDetectorWithOptions:options];
}

+ (NSDictionary *)findPose:(Frame *)frame {
  CMSampleBufferRef buffer = frame.buffer;
  UIImageOrientation orientation = frame.orientation;
  
  MLKVisionImage *image = [[MLKVisionImage alloc] initWithBuffer:buffer];
  image.orientation = orientation;

  NSError *error;
  NSArray *poses = [poseDetector resultsInImage:image error:&error];
  
  if (error != nil) {
    NSLog(@"Pose detection error: %@", error);
    return @{};
  }
  
  if (poses.count == 0) {
    NSLog(@"No poses detected");
    return @{};
  }
  
  for (MLKPose *pose in poses) {
    return @{
//      body landmarks
      @"landmark_0":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeNose]],
      
      @"landmark_4":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightEyeInner]],
      @"landmark_5":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightEye]],
      @"landmark_6":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightEyeOuter]],
      
      @"landmark_1":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftEyeInner]],
      @"landmark_2":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftEye]],
      @"landmark_3":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftEyeOuter]],
      
      @"landmark_8":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightEar]],
      @"landmark_7":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftEar]],

      @"landmark_10":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeMouthRight]],
      @"landmark_9":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeMouthLeft]],
      
      @"landmark_12":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightShoulder]],
      @"landmark_11":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftShoulder]],
      
      @"landmark_14":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightElbow]],
      @"landmark_13":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftElbow]],
      
      @"landmark_16":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightWrist]],
      @"landmark_15":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftWrist]],
      
      @"landmark_18":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightPinkyFinger]],
      @"landmark_17":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftPinkyFinger]],
      
      @"landmark_20":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightIndexFinger]],
      @"landmark_19":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftIndexFinger]],
      
      @"landmark_22":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightThumb]],
      @"landmark_21":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftThumb]],
      
      @"landmark_24":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightHip]],
      @"landmark_23":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftHip]],
      
      @"landmark_26":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightKnee]],
      @"landmark_25":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftKnee]],
      
      @"landmark_28":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightAnkle]],
      @"landmark_27":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftAnkle]],
      
      @"landmark_30":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightHeel]],
      @"landmark_29":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftHeel]],
      
      @"landmark_32":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightToe]],
      @"landmark_31":[self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftToe]],
      
    };
  }
  
  return @{};
}

+ (NSDictionary *)getLandmarkPosition:(MLKPoseLandmark *)landmark {
  MLKVision3DPoint *position = landmark.position;
  return @{
    @"x": @(position.x),
    @"y": @(position.y),
    @"z": @(position.z),
    @"visibility": @(landmark.inFrameLikelihood)
  };
}

@end
