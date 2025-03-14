CONFIG_MODE_ON = "~M00910001." 
OUTPUT_MODE = "~M00510000."
CONTINUOUS_MODE = "~M00210001."    
SAVE_CONFIG = "~MA5F0506A."      
CONFIG_MODE_OFF = "~M00910000."  
SET_DELAY = "~M00B0000F."  #reading interval setting: 1.45 seconds

CONFIG_SEQUENCE = [
    CONFIG_MODE_ON,
    OUTPUT_MODE,
    CONTINUOUS_MODE,
    SET_DELAY,
    SAVE_CONFIG,
    CONFIG_MODE_OFF,
]

TRIGGER_SCAN = "SCAN\n"  
STOP_SCAN = "STOP\n"
STATUS_CHECK = "STATUS\n"