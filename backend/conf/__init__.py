import configparser

# config.iniの読み込み


class Section:
    def __init__(self, section_dict):
        for key, value in section_dict.items():
            setattr(self, key, value)


class Config:
    def __init__(self):
        config = configparser.ConfigParser()
        config.read("conf/config.ini", encoding="utf-8")
        for section in config.sections():
            # 各セクションをインスタンス変数として追加
            section_dict = dict(config[section])
            setattr(self, section, Section(section_dict))
