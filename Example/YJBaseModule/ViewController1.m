//
//  ViewController1.m
//  Test
//
//  Created by 刘亚军 on 2018/5/3.
//  Copyright © 2018年 刘亚军. All rights reserved.
//

#import "ViewController1.h"


@interface ViewController1 ()

@end

@implementation ViewController1

- (void)viewDidLoad {
    [super viewDidLoad];
   
    
}
- (void)yj_interactivePopGestureAction{
    NSLog(@"%@ pop 了啊",NSStringFromClass(self.class));
}
- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];

}


@end
