//
//  VideoAdViewController.m
//  BeerNotesRN
//
//  Created by bb s on 10/25/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "VideoAdViewController.h"
#import "UMVideoAd.h"
#import "AppDelegate.h"

#define KIsiPhoneX ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? CGSizeEqualToSize(CGSizeMake(1125, 2436), [[UIScreen mainScreen] currentMode].size) : NO)

@interface VideoAdViewController ()
@property  UIView *videoAdView;
@property  UIView *bootomView;
@property  UIImageView *appIcon;
@property  UILabel *appName;
@property  UILabel *goBut;

- (void)onClose;
- (void)initView;
- (void)closeVideoAd;

@property int currentCountDown;
@property  NSTimer *timer;

- (void)removeCountdown;

@end

@implementation VideoAdViewController

-(void)viewWillAppear:(BOOL)animated{
  [super viewWillAppear:animated];
  [self.navigationController setNavigationBarHidden:YES];
}

-(void)viewWillDisappear:(BOOL)animated{
  [super viewWillDisappear:animated];
  [self.navigationController setNavigationBarHidden:NO];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [self initView];
  
    [UMVideoAd initAppID:youmi_appid appKey:youmi_appkey cacheVideo:YES];
  
    //开启非wifi预缓存视频文件
    [UMVideoAd videoDownloadOnUNWifi:YES];
  
    /*
     isHaveVideoStatue 的值目前有两个
     0：现有可以播放视频
     1：暂时没有可播放视频
     2：网络状态不好
     */
    [UMVideoAd videoHasCanPlayVideo:^(int isHaveVideoStatue){
      NSLog(@"是否有视频：%d",isHaveVideoStatue);
      if(isHaveVideoStatue == 0){
        CGRect rect = CGRectMake(0, 20,  self.videoAdView.bounds.size.width,  self.videoAdView.bounds.size.height-80-20);
        [UMVideoAd videoPlay:self videoSuperView:self.videoAdView videoPlayerFrame:rect videoPlayFinishCallBackBlock:^(BOOL isFinishPlay){
          if (isFinishPlay) {
            NSLog(@"视频播放结束");
            [self closeVideoAd];
          }else{
            NSLog(@"中途退出");
          }
        } videoPlayConfigCallBackBlock:^(BOOL isLegal){
          //注意：  isLegal在（app有联网，并且注册的appkey后台审核通过）的情况下才返回yes, 否则都是返回no.
          NSString *message = @"";
          if (isLegal) {
            message = @"此次播放有效";
          }else{
            message = @"此次播放无效";
          }
          NSLog(@"是否有效：%@",message);
        }];
      }else{
        [self closeVideoAd];
      }
    }];
  
    [UMVideoAd videoIsForceLandscape:NO];
    [UMVideoAd videoCloseAlertViewWhenWantExit:NO];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
- (void)closeVideoAd {
  AppDelegate *delegate = (AppDelegate *)([UIApplication sharedApplication].delegate);
  UIViewController *rootVC = delegate.window.rootViewController;
  [rootVC dismissViewControllerAnimated:YES completion:nil];
}

-(void)onClose{
  [self closeVideoAd];
}

- (void)initView{
  CGRect bounds = self.view.bounds;

  CGRect temp_bounds = bounds;
  if(KIsiPhoneX){
    temp_bounds =  CGRectMake(0,44,bounds.size.width,bounds.size.height-44-34);
  }
  self.videoAdView = [[UIView alloc] initWithFrame:temp_bounds];
//  self.videoAdView.backgroundColor = [UIColor redColor];
  
  self.view.backgroundColor = [UIColor whiteColor];
  [self.view addSubview:self.videoAdView];
  
  self.bootomView = [[UIView alloc] initWithFrame:CGRectMake(0,self.videoAdView.bounds.size.height-80, bounds.size.width, 80)];
//  UIView *bootomBgView = [[UIView alloc] initWithFrame:CGRectMake(0,0, bounds.size.width, 80)];
//  bootomBgView.backgroundColor = [UIColor blackColor];
//  bootomBgView.alpha = 0.3;
//  [self.bootomView addSubview:bootomBgView];
  
   NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
   NSString *icon = [[infoPlist valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
  self.appIcon = [[UIImageView alloc]initWithFrame:CGRectMake(20, 20, 40, 40)];
  [self.appIcon setImage:[UIImage imageNamed:icon]];
  [self.bootomView addSubview:self.appIcon];
  
  NSString *appName = [infoPlist valueForKey:@"CFBundleDisplayName"];
  self.appName = [[UILabel alloc]initWithFrame:CGRectMake(70, 20, 200, 40)];
  self.appName.text = appName;
  self.appName.textColor = [VideoAdViewController colorWithHexString:@"#232323"];
  self.appName.font = [UIFont systemFontOfSize:23.0];
  [self.bootomView addSubview:self.appName];
  
  self.goBut = [[UILabel alloc]initWithFrame:CGRectMake(bounds.size.width-60, 20, 60, 40)];
  self.goBut.text = @"进入";
  self.goBut.textColor = [VideoAdViewController colorWithHexString:@"#7B8992"];
  self.goBut.font = [UIFont systemFontOfSize:18.0];
  self.goBut.textAlignment = NSTextAlignmentCenter;
  UITapGestureRecognizer *labelTapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onClose)];
  [self.goBut addGestureRecognizer:labelTapGestureRecognizer];
  self.goBut.userInteractionEnabled = YES;
  [self.bootomView addSubview:self.goBut];
  
  [self.videoAdView addSubview:self.bootomView];

}

- (void) startCountdown
{
  self.currentCountDown = 4;
  self.timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(countDown) userInfo:nil repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer:self.timer forMode:NSRunLoopCommonModes];
  [self.timer fire];
}

- (void)countDown{
  
  if (self.currentCountDown >0) {
    //设置界面的按钮显示 根据自己需求设置
    NSLog(@"%i秒",self.currentCountDown);
    //self.captchaBtn.enabled = NO;
    self.currentCountDown -= 1;
  }else{
    [self removeCountdown];
  }
  
}


- (void)removeCountdown
{
  self.currentCountDown = 0;
  [self.timer invalidate];
  self.timer = nil;
}



+ (UIColor *)colorWithHexString:(NSString *)color alpha:(CGFloat)alpha
{
  //删除字符串中的空格
  NSString *cString = [[color stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
  // String should be 6 or 8 characters
  if ([cString length] < 6)
  {
    return [UIColor clearColor];
  }
  // strip 0X if it appears
  //如果是0x开头的，那么截取字符串，字符串从索引为2的位置开始，一直到末尾
  if ([cString hasPrefix:@"0X"])
  {
    cString = [cString substringFromIndex:2];
  }
  //如果是#开头的，那么截取字符串，字符串从索引为1的位置开始，一直到末尾
  if ([cString hasPrefix:@"#"])
  {
    cString = [cString substringFromIndex:1];
  }
  if ([cString length] != 6)
  {
    return [UIColor clearColor];
  }
  
  // Separate into r, g, b substrings
  NSRange range;
  range.location = 0;
  range.length = 2;
  //r
  NSString *rString = [cString substringWithRange:range];
  //g
  range.location = 2;
  NSString *gString = [cString substringWithRange:range];
  //b
  range.location = 4;
  NSString *bString = [cString substringWithRange:range];
  
  // Scan values
  unsigned int r, g, b;
  [[NSScanner scannerWithString:rString] scanHexInt:&r];
  [[NSScanner scannerWithString:gString] scanHexInt:&g];
  [[NSScanner scannerWithString:bString] scanHexInt:&b];
  return [UIColor colorWithRed:((float)r / 255.0f) green:((float)g / 255.0f) blue:((float)b / 255.0f) alpha:alpha];
}

//默认alpha值为1
+ (UIColor *)colorWithHexString:(NSString *)color
{
  return [self colorWithHexString:color alpha:1.0f];
}

@end
