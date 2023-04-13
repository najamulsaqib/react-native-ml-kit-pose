//
//  PoseDetectionFrameProcessor.m
//  Camera
//
//  Created by Najam Ul Saqib on 11/04/2023.
//

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/Frame.h>
#import "PoseDetection.h"

@interface PoseDetectionFrameProcessor : NSObject
@end

@implementation PoseDetectionFrameProcessor

static inline id poseDetection(Frame* frame, NSArray* args) {
    
  return [PoseDetection findPose:frame];
}

VISION_EXPORT_FRAME_PROCESSOR(poseDetection)

@end
