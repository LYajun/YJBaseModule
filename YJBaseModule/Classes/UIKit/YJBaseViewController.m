//
//  YJBaseViewController.m
//  Pods-YJBaseModule_Example
//
//  Created by 刘亚军 on 2019/7/20.
//

#import "YJBaseViewController.h"
#import "YJBaseNavigationController.h"

@interface YJBaseViewController ()<UINavigationControllerDelegate>

@end

@implementation YJBaseViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
}
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)] && self.closeSideslip) {
        self.navigationController.interactivePopGestureRecognizer.enabled = NO;
        ((YJBaseNavigationController *)self.navigationController).backGesture.enabled = NO;
    }else if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)] && !self.closeSideslip && self.closeFullScreenSideslip) {
        ((YJBaseNavigationController *)self.navigationController).backGesture.enabled = NO;
    }
}
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.view endEditing:YES];
    
    if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)] && self.closeSideslip) {
        self.navigationController.interactivePopGestureRecognizer.enabled = YES;
        ((YJBaseNavigationController *)self.navigationController).backGesture.enabled = YES;
    }else if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)] && !self.closeSideslip && self.closeFullScreenSideslip) {
        ((YJBaseNavigationController *)self.navigationController).backGesture.enabled = YES;
    }
}

#pragma mark - UINavigationControllerDelegate
- (void)willMoveToParentViewController:(UIViewController *)parent{
    [super willMoveToParentViewController:parent];
    NSLog(@"%s,%@",__FUNCTION__,NSStringFromClass(self.class));
}
- (void)didMoveToParentViewController:(UIViewController *)parent{
    [super didMoveToParentViewController:parent];
    NSLog(@"%s,%@",__FUNCTION__,NSStringFromClass(self.class));
    if(!parent){
        [self yj_interactivePopGestureAction];
    }
}
- (void)yj_interactivePopGestureAction{
}
- (void)yj_setNavigationDelegate{
    self.navigationController.delegate = self;
}
// 将要显示控制器
- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated {
    // 判断要显示的控制器是否是自己
    BOOL isShowHomePage = [viewController isKindOfClass:[self class]];
    [self.navigationController setNavigationBarHidden:isShowHomePage animated:YES];
}

#pragma mark - Dealloc
- (void)dealloc {
    self.navigationController.delegate = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    NSLog(@"****** %@--dealloc *******", NSStringFromClass([self class]));
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    NSLog(@"%@ didReceiveMemoryWarning", NSStringFromClass([self class]));
}
@end
