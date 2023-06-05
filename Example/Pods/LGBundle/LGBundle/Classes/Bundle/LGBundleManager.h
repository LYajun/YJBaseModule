//
//  LGBundleManager.h
//  LGBundle
//
//  Created by 刘亚军 on 2020/7/9.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
#define IsIPad (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
@interface LGBundleManager : NSObject
+ (LGBundleManager *)defaultManager;
@property (nonatomic,assign) CGFloat loadingGifWidth;
- (NSBundle *)bundle;
- (NSBundle *)barBundle;


- (NSArray *)loadingImgs;

- (NSString *)emptyDir;
- (NSString *)errorDir;
- (NSString *)searchEmptyDir;
- (NSString *)loadingDir;

- (NSString *)navbarBgDir;

- (NSString *)pathInBundleWithName:(NSString *)name;
- (NSString *)pathInBarBundleWithName:(NSString *)name;

@end

NS_ASSUME_NONNULL_END
