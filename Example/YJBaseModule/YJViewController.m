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



@end
