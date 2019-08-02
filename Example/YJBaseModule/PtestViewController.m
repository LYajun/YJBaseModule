//
//  PtestViewController.m
//  Test
//
//  Created by 刘亚军 on 2019/4/10.
//  Copyright © 2019 刘亚军. All rights reserved.
//

#import "PtestViewController.h"
#import "ViewController1.h"

@interface PtestViewController ()

@end

@implementation PtestViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.closeFullScreenSideslip = NO;
}
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self yj_setNavigationDelegate];
}
- (void)yj_interactivePopGestureAction{
     NSLog(@"%@ pop 了啊",NSStringFromClass(self.class));
}
- (IBAction)push:(id)sender {
    [self yj_setLoadingGifViewShow:YES];
//    ViewController1 *vc = [[ViewController1 alloc] init];
//    [self.navigationController pushViewController:vc animated:YES];
}

@end
