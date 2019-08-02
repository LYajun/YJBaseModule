//
//  YJViewController.m
//  YJBaseModule
//
//  Created by lyj on 07/20/2019.
//  Copyright (c) 2019 lyj. All rights reserved.
//

#import "YJViewController.h"
#import "PtestViewController.h"


@interface YJViewController ()

@end

@implementation YJViewController

- (void)viewDidLoad{
    [super viewDidLoad];
	
}

- (IBAction)push:(id)sender {
    
    PtestViewController *vc = [[PtestViewController alloc] init];
    [self.navigationController pushViewController:vc animated:YES];
}
- (IBAction)cancel:(id)sender {
    [self yj_setLoadingViewShow:NO];
}

- (IBAction)point:(id)sender {
    [self yj_setLoadingViewShow:YES];
}
- (IBAction)pointBg:(id)sender {
    [self yj_setLoadingViewShow:YES backgroundColor:[UIColor colorWithWhite:0.2 alpha:0.4] tintColor:[UIColor whiteColor]];
}
- (IBAction)flower:(id)sender {
    [self yj_setLoadingFlowerTitleViewShow:YES];
}
- (IBAction)gif:(id)sender {
    [self yj_setLoadingGifViewShow:YES];
}
- (IBAction)empty:(id)sender {
    [self yj_setNoDataViewShow:YES isSearch:YES];
}

- (IBAction)loadError:(id)sender {
    [self yj_setLoadErrorViewShow:YES];
}

@end
