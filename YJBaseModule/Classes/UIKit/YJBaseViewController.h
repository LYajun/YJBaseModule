//
//  YJBaseViewController.h
//  Pods-YJBaseModule_Example
//
//  Created by 刘亚军 on 2019/7/20.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface YJBaseViewController : UIViewController

/** 是否关闭侧滑iOS默认手势，默认不关闭 */
@property (nonatomic, assign) BOOL closeSideslip;
/** 是否关闭全屏滑动，当侧滑关闭的时候，全屏滑动失效 */
@property (nonatomic, assign) BOOL closeFullScreenSideslip;

- (void)yj_interactivePopGestureAction;
- (void)yj_setNavigationDelegate;
@end

NS_ASSUME_NONNULL_END
