//
//  PoseDetection.h
//  Camera
//
//  Created by Najam Ul Saqib on 11/04/2023.
//

#ifndef PoseDetection_h
#define PoseDetection_h

#include <Foundation/Foundation.h>
#import <UIKit/UIImage.h>
#import <CoreMedia/CMSampleBuffer.h>
#import <VisionCamera/Frame.h>

@interface PoseDetection: NSObject
+ (NSDictionary *)findPose:(Frame *)frame;
@end

#endif /* PoseDetection_h */
