#import "LibScanImageCodeBank.h"
#import <React/RCTBridgeModule.h>
#import "LibScanImageCodeBank-Swift.h" 

@implementation LibScanImageCodeBank

RCT_EXPORT_MODULE(LibScanImageCodeBank)

- (NSNumber *)multiply:(double)a b:(double)b {
    return [LibScanImageCodeBankHelper multiply:a b:b];
}
- (void)scanFromPath:(NSString *)path
            resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
    [LibScanImageCodeBankHelper scanFromPath:path resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeLibScanImageCodeBankSpecJSI>(params);
}

@end
