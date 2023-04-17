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
      @"leftShoulder": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftShoulder]],
      @"rightShoulder": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightShoulder]],
      @"leftElbow": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftElbow]],
      @"rightElbow": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightElbow]],
      @"leftWrist": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftWrist]],
      @"rightWrist": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightWrist]],
      @"leftHip": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftHip]],
      @"rightHip": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightHip]],
      @"leftKnee": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftKnee]],
      @"rightKnee": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightKnee]],
      @"leftAnkle": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftAnkle]],
      @"rightAnkle": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightAnkle]],
      @"leftPinky": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftPinkyFinger]],
//      hand and feet landmarks
      @"leftIndex": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftIndexFinger]],
      @"leftThumb": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftThumb]],
      @"leftHeel": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftHeel]],
      @"leftFootIndex": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftToe]],
      @"rightPinky": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightPinkyFinger]],
      @"rightIndex": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightIndexFinger]],
      @"rightThumb": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightThumb]],
      @"rightHeel": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightHeel]],
      @"rightFootIndex": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightToe]],
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
