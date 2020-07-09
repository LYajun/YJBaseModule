//
//  LGBundleManager.m
//  LGBundle
//
//  Created by 刘亚军 on 2020/7/9.
//

#import "LGBundleManager.h"

@interface LGBundleManager ()
@property (nonatomic,strong) NSArray *loadingImgs;
@property (nonatomic,strong) NSBundle *currentBundle;
@end
@implementation LGBundleManager
+ (LGBundleManager *)defaultManager{
    static LGBundleManager * macro = nil;
       static dispatch_once_t onceToken;
       dispatch_once(&onceToken, ^{
           macro = [[LGBundleManager alloc]init];
           [macro configure];
       });
       return macro;
}

- (void)configure{
    _currentBundle = [NSBundle bundleWithPath:[[NSBundle bundleForClass:LGBundleManager.class] pathForResource:@"LGBundle" ofType:@"bundle"]];
    
    [self initLoadingImg];
}

- (void)initLoadingImg{
    CFAbsoluteTime startTime =CFAbsoluteTimeGetCurrent();
    NSFileManager *fielM = [NSFileManager defaultManager];
    NSArray *arrays = [fielM contentsOfDirectoryAtPath:[self loadingDir] error:nil];
    NSMutableArray *imageArr = [NSMutableArray array];
    for (NSInteger i = 1; i <= arrays.count; i++) {
        NSString *imagePath = [NSString stringWithFormat:@"%@/loading%li.jpg",self.loadingDir,i];
        UIImage *image =  [UIImage imageWithContentsOfFile:imagePath];
        if (image) {
            [imageArr addObject:image];
        }
    }
    NSLog(@"loadingGifImg Linked in %f ms", (CFAbsoluteTimeGetCurrent() - startTime) *1000.0);
    self.loadingImgs = imageArr;
}

- (NSString *)emptyDir{
    return [[_currentBundle resourcePath] stringByAppendingPathComponent:@"Empty"];
}
- (NSString *)errorDir{
    return [[_currentBundle resourcePath] stringByAppendingPathComponent:@"Error"];
}
- (NSString *)searchEmptyDir{
    return [[_currentBundle resourcePath] stringByAppendingPathComponent:@"SearchEmpty"];
}
- (NSString *)loadingDir{
    return [[_currentBundle resourcePath] stringByAppendingPathComponent:@"Loading1"];
}
- (NSString *)pathWithName:(NSString *)name{
    return [[_currentBundle resourcePath] stringByAppendingPathComponent:name];
}

@end
