//
//  ViewController3.m
//  Test
//
//  Created by 刘亚军 on 2018/9/6.
//  Copyright © 2018年 刘亚军. All rights reserved.
//

#import "ViewController3.h"
#import "ViewController4.h"
#import "ViewController2.h"
@interface ViewController3 ()

@end

@implementation ViewController3

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor redColor];
    // Do any additional setup after loading the view.
}
- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    UIViewController *vc = self.presentingViewController;
    
    //ReadBookController要跳转的界面
    while (vc && ![vc isKindOfClass:[ViewController2 class]]) {
        vc = vc.presentingViewController;
    }
    if (vc) {
        [vc dismissViewControllerAnimated:NO completion:nil];
    }
}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
      [self presentViewController:[[ViewController4 alloc] init] animated:NO completion:nil];
}
- (void)dealloc{
    NSLog(@"dealloc3");
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
